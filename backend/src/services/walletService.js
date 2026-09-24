const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');

/**
 * Get or initialize user's wallet
 */
const getOrCreateWallet = async (userId) => {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = await Wallet.create({
      userId,
      veBalance: 0,
      totalVeEarned: 0,
      amazonGiftCards: [],
      totalAmazonEarned: 0,
    });
  }
  return wallet;
};

/**
 * Generate a realistic Amazon Gift Card voucher code
 */
const generateGiftCardCode = () => {
  const segment1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const segment2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const segment3 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AMZ-${segment1}-${segment2}-${segment3}`;
};

/**
 * Credit reward to user wallet atomically
 */
const creditStreakReward = async ({ userId, reward, claimId }) => {
  let wallet = await getOrCreateWallet(userId);
  let giftCardCode = null;
  let transaction;

  if (reward.rewardType === 'VE') {
    const updatedWallet = await Wallet.findOneAndUpdate(
      { userId },
      {
        $inc: {
          veBalance: reward.value,
          totalVeEarned: reward.value,
        },
      },
      { new: true }
    );

    transaction = await WalletTransaction.create({
      userId,
      walletId: updatedWallet._id,
      type: 'CREDIT',
      category: 'DAILY_STREAK_REWARD',
      amount: reward.value,
      currency: 'VE',
      description: `Daily Streak Day ${reward.dayNumber} reward: +${reward.value} VEs`,
      referenceId: claimId,
      balanceAfter: updatedWallet.veBalance,
      metadata: {
        dayNumber: reward.dayNumber,
        rewardTitle: reward.title,
      },
    });

    wallet = updatedWallet;
  } else if (reward.rewardType === 'AMAZON_GIFT_CARD') {
    giftCardCode = generateGiftCardCode();
    const pin = Math.floor(1000 + Math.random() * 9000).toString();

    const updatedWallet = await Wallet.findOneAndUpdate(
      { userId },
      {
        $inc: {
          totalAmazonEarned: reward.value,
        },
        $push: {
          amazonGiftCards: {
            code: giftCardCode,
            amount: reward.value,
            currency: 'INR',
            claimId,
            claimedAt: new Date(),
            isRedeemed: false,
            pin,
          },
        },
      },
      { new: true }
    );

    transaction = await WalletTransaction.create({
      userId,
      walletId: updatedWallet._id,
      type: 'CREDIT',
      category: 'DAILY_STREAK_REWARD',
      amount: reward.value,
      currency: 'INR_GIFT_CARD',
      description: `Daily Streak Day ${reward.dayNumber} reward: ₹${reward.value} Amazon Gift Card (${giftCardCode})`,
      referenceId: claimId,
      balanceAfter: updatedWallet.veBalance,
      metadata: {
        dayNumber: reward.dayNumber,
        giftCardCode,
        rewardTitle: reward.title,
      },
    });

    wallet = updatedWallet;
  }

  return { wallet, giftCardCode, transaction };
};

/**
 * Redeem an Amazon gift card voucher
 */
const redeemGiftCardVoucher = async (userId, voucherId) => {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    throw new Error('Wallet not found');
  }

  const voucher = wallet.amazonGiftCards.id(voucherId);
  if (!voucher) {
    throw new Error('Gift card voucher not found');
  }

  if (voucher.isRedeemed) {
    throw new Error('This gift card has already been redeemed to Amazon Pay');
  }

  voucher.isRedeemed = true;
  await wallet.save();

  return voucher;
};

module.exports = {
  getOrCreateWallet,
  creditStreakReward,
  redeemGiftCardVoucher,
};
