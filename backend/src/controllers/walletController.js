const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const { getOrCreateWallet, redeemGiftCardVoucher } = require('../services/walletService');

/**
 * @route   GET /api/wallet
 * @desc    Get user's wallet balance, gift cards, and recent transactions
 * @access  Private
 */
const getWallet = async (req, res, next) => {
  try {
    const wallet = await getOrCreateWallet(req.user._id);

    const transactions = await WalletTransaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      data: {
        veBalance: wallet.veBalance,
        totalVeEarned: wallet.totalVeEarned,
        totalAmazonEarned: wallet.totalAmazonEarned,
        amazonGiftCards: wallet.amazonGiftCards,
        transactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/wallet/redeem-gift-card/:id
 * @desc    Mark an Amazon gift card voucher as redeemed
 * @access  Private
 */
const redeemGiftCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const voucher = await redeemGiftCardVoucher(req.user._id, id);

    return res.status(200).json({
      success: true,
      message: `Gift card ${voucher.code} has been marked as redeemed!`,
      data: voucher,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWallet,
  redeemGiftCard,
};
