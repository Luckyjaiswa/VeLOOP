const crypto = require('crypto');
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const { getOrCreateWallet } = require('../services/walletService');
const { logAudit } = require('../services/auditService');

const STORE_ITEMS = {
  AMAZON_5: {
    id: 'AMAZON_5',
    title: 'Amazon Pay ₹5 Voucher',
    brand: 'Amazon Pay',
    amount: 5,
    costInVEs: 100,
    prefix: 'AMZN',
    badgeColor: '#F59E0B',
    description: 'Instant ₹5 Amazon Pay balance code for shopping & bill payments',
  },
  AMAZON_10: {
    id: 'AMAZON_10',
    title: 'Amazon Pay ₹10 Voucher',
    brand: 'Amazon Pay',
    amount: 10,
    costInVEs: 200,
    prefix: 'AMZN',
    badgeColor: '#F59E0B',
    description: 'Instant ₹10 Amazon Pay balance code for shopping, recharge & utilities',
  },
  GOOGLE_PLAY_10: {
    id: 'GOOGLE_PLAY_10',
    title: 'Google Play ₹10 Code',
    brand: 'Google Play',
    amount: 10,
    costInVEs: 200,
    prefix: 'GPLY',
    badgeColor: '#10B981',
    description: '₹10 Play Store recharge code for apps, games & in-app purchases',
  },
  GOOGLE_PLAY_25: {
    id: 'GOOGLE_PLAY_25',
    title: 'Google Play ₹25 Code',
    brand: 'Google Play',
    amount: 25,
    costInVEs: 450,
    prefix: 'GPLY',
    badgeColor: '#10B981',
    description: '₹25 Play Store recharge code for game passes, ebooks, and premium apps',
  },
  FLIPKART_25: {
    id: 'FLIPKART_25',
    title: 'Flipkart ₹25 Voucher',
    brand: 'Flipkart',
    amount: 25,
    costInVEs: 450,
    prefix: 'FKRT',
    badgeColor: '#3B82F6',
    description: '₹25 Flipkart digital gift card redeemable across all categories',
  },
  FLIPKART_50: {
    id: 'FLIPKART_50',
    title: 'Flipkart ₹50 Voucher',
    brand: 'Flipkart',
    amount: 50,
    costInVEs: 850,
    prefix: 'FKRT',
    badgeColor: '#3B82F6',
    description: '₹50 Flipkart digital voucher for electronics, fashion and household',
  },
};

/**
 * Generate a unique 16-character alphanumeric voucher code:
 * Format: [PREFIX(4)]-[SEG1(4)]-[SEG2(4)]-[SEG3(4)] (e.g., AMZN-9F4K-28LA-Q812)
 * Total: exactly 16 alphanumeric characters separated by hyphens.
 */
const generateVoucherCode = (prefix = 'AMZN') => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Unambiguous uppercase alphanumeric
  const randomSegment = (len = 4) => {
    const bytes = crypto.randomBytes(len);
    let str = '';
    for (let i = 0; i < len; i++) {
      str += chars[bytes[i] % chars.length];
    }
    return str;
  };

  const formattedPrefix = (prefix || 'AMZN').slice(0, 4).toUpperCase().padEnd(4, 'X');
  const seg1 = randomSegment(4);
  const seg2 = randomSegment(4);
  const seg3 = randomSegment(4);

  return `${formattedPrefix}-${seg1}-${seg2}-${seg3}`;
};

/**
 * @route   GET /api/rewards/catalog
 * @desc    Get all available vouchers in the Rewards Store
 * @access  Private / Public
 */
exports.getStoreCatalog = async (req, res, next) => {
  try {
    let veBalance = 0;
    if (req.user) {
      const wallet = await getOrCreateWallet(req.user._id);
      veBalance = wallet.veBalance;
    }

    const items = Object.values(STORE_ITEMS).map((item) => ({
      ...item,
      canAfford: veBalance >= item.costInVEs,
    }));

    return res.status(200).json({
      success: true,
      data: {
        items,
        userVeBalance: veBalance,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/rewards/redeem
 * @desc    Redeem VE Coins for digital gift voucher
 *          - Validates sufficient balance
 *          - Deducts required VEs atomically
 *          - Generates 16-character alphanumeric voucher code
 *          - Saves transaction to history & pushes to user's active vouchers
 * @access  Private
 */
exports.redeemVoucher = async (req, res, next) => {
  try {
    const { rewardType, brand: reqBrand, amount: reqAmount, costInVEs: reqCost } = req.body;

    let targetItem = null;

    if (rewardType) {
      const normalizedKey = rewardType.toUpperCase();
      targetItem = STORE_ITEMS[normalizedKey];
    }

    // Fallback: allow custom brand/amount if costInVEs is provided
    if (!targetItem && reqBrand && reqAmount && reqCost) {
      const brandPrefix = reqBrand.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'VLOP';
      targetItem = {
        id: `CUSTOM_${brandPrefix}_${reqAmount}`,
        title: `${reqBrand} ₹${reqAmount} Voucher`,
        brand: reqBrand,
        amount: Number(reqAmount),
        costInVEs: Number(reqCost),
        prefix: brandPrefix,
        description: `₹${reqAmount} ${reqBrand} digital voucher`,
      };
    }

    if (!targetItem) {
      return res.status(400).json({
        success: false,
        message:
          'Please specify a valid reward item to redeem (e.g. AMAZON_5, AMAZON_10, GOOGLE_PLAY_10, GOOGLE_PLAY_25, FLIPKART_25, FLIPKART_50).',
      });
    }

    // Ensure wallet exists
    const currentWallet = await getOrCreateWallet(req.user._id);

    // 1. Validate sufficient VEs balance
    if (currentWallet.veBalance < targetItem.costInVEs) {
      return res.status(400).json({
        success: false,
        message: `Insufficient VE balance! You need ${targetItem.costInVEs} VEs for this ₹${targetItem.amount} ${targetItem.brand} voucher, but you currently have ${currentWallet.veBalance} VEs.`,
      });
    }

    // 2. Generate unique 16-character alphanumeric voucher code & 4-digit PIN
    const voucherCode = generateVoucherCode(targetItem.prefix);
    const pin = Math.floor(1000 + Math.random() * 9000).toString();

    const voucherEntry = {
      code: voucherCode,
      brand: targetItem.brand,
      amount: targetItem.amount,
      currency: 'INR',
      isRedeemed: false,
      pin,
      claimedAt: new Date(),
    };

    // 3. Atomically deduct VEs and push voucher to active vouchers array
    // This atomic update prevents double-spend race conditions
    const updateQuery = {
      $inc: { veBalance: -targetItem.costInVEs },
      $push: { amazonGiftCards: voucherEntry },
    };

    if (targetItem.brand === 'Amazon Pay') {
      updateQuery.$inc.totalAmazonEarned = targetItem.amount;
    }

    const updatedWallet = await Wallet.findOneAndUpdate(
      {
        _id: currentWallet._id,
        veBalance: { $gte: targetItem.costInVEs }, // Strict atomic check
      },
      updateQuery,
      { new: true }
    );

    if (!updatedWallet) {
      return res.status(400).json({
        success: false,
        message: 'Transaction failed: Insufficient VE balance or concurrent redemption.',
      });
    }

    // Get the newly added voucher subdocument with its generated _id
    const savedVoucher = updatedWallet.amazonGiftCards[updatedWallet.amazonGiftCards.length - 1];

    // 4. Save transaction to user's history
    const transaction = await WalletTransaction.create({
      userId: req.user._id,
      walletId: updatedWallet._id,
      type: 'DEBIT',
      category: 'STORE_REDEMPTION',
      amount: targetItem.costInVEs,
      currency: 'VE',
      description: `Redeemed ${targetItem.brand} ₹${targetItem.amount} Voucher (${targetItem.costInVEs} VEs)`,
      balanceAfter: updatedWallet.veBalance,
      metadata: {
        code: voucherCode,
        pin,
        brand: targetItem.brand,
        amount: targetItem.amount,
        voucherId: savedVoucher?._id,
      },
    });

    // 5. Audit log
    await logAudit({
      userId: req.user._id,
      action: 'STORE_VOUCHER_REDEEMED',
      metadata: {
        brand: targetItem.brand,
        amount: targetItem.amount,
        costInVEs: targetItem.costInVEs,
        code: voucherCode,
        newBalance: updatedWallet.veBalance,
        transactionId: transaction._id,
      },
      status: 'SUCCESS',
    });

    return res.status(200).json({
      success: true,
      message: `🎉 Successfully redeemed ${targetItem.brand} ₹${targetItem.amount} Voucher!`,
      data: {
        voucher: savedVoucher || voucherEntry,
        newBalance: updatedWallet.veBalance,
        item: targetItem,
        transaction: {
          id: transaction._id,
          type: transaction.type,
          amount: transaction.amount,
          balanceAfter: transaction.balanceAfter,
          createdAt: transaction.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
