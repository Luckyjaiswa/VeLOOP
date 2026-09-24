const mongoose = require('mongoose');

const streakClaimSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    cycleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StreakCycle',
      required: true,
      index: true,
    },
    cycleNumber: {
      type: Number,
      required: true,
    },
    dayNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },
    rewardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StreakReward',
      required: true,
    },
    rewardSnapshot: {
      rewardType: { type: String, required: true },
      value: { type: Number, required: true },
      currency: { type: String, required: true },
      title: { type: String, required: true },
    },
    cpaStatus: {
      type: String,
      enum: ['NOT_REQUIRED', 'VERIFIED', 'FAILED'],
      default: 'VERIFIED',
    },
    cpaEngagementSeconds: {
      type: Number,
      default: 3,
    },
    giftCardCode: {
      type: String,
      default: null,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    claimedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate claims for the same day in the same cycle
streakClaimSchema.index({ userId: 1, cycleId: 1, dayNumber: 1 }, { unique: true });

module.exports = mongoose.model('StreakClaim', streakClaimSchema);
