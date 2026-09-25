const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const { getOrCreateWallet, redeemGiftCardVoucher } = require('../services/walletService');

/**
 * @route   GET /api/wallet
 * @desc    Get user's wallet balance, gift cards / vouchers, and recent transactions
 * @access  Private
 */
const getWallet = async (req, res, next) => {
  try {
    const wallet = await getOrCreateWallet(req.user._id);

    const transactions = await WalletTransaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const vouchers = wallet.amazonGiftCards || [];
    const activeVouchers = vouchers.filter((v) => !v.isRedeemed);
    const redeemedVouchers = vouchers.filter((v) => v.isRedeemed);

    return res.status(200).json({
      success: true,
      data: {
        veBalance: wallet.veBalance,
        totalVeEarned: wallet.totalVeEarned,
        totalAmazonEarned: wallet.totalAmazonEarned,
        amazonGiftCards: vouchers,
        vouchers,
        activeVouchers,
        redeemedVouchers,
        transactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/wallet/redeem/:id
 * @desc    Mark a voucher as redeemed
 * @access  Private
 */
const redeemGiftCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const voucher = await redeemGiftCardVoucher(req.user._id, id);

    return res.status(200).json({
      success: true,
      message: `Voucher ${voucher.code} marked as redeemed!`,
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
