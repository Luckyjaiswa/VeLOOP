const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    claimId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StreakClaim',
    },
    claimedAt: {
      type: Date,
      default: Date.now,
    },
    isRedeemed: {
      type: Boolean,
      default: false,
    },
    pin: {
      type: String,
      default: '7829',
    },
  },
  { _id: true }
);

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    veBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalVeEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
    amazonGiftCards: [giftCardSchema],
    totalAmazonEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Wallet', walletSchema);
