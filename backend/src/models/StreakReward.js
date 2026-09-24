const mongoose = require('mongoose');

const streakRewardSchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
      unique: true,
      index: true,
    },
    rewardType: {
      type: String,
      required: true,
      enum: ['VE', 'AMAZON_GIFT_CARD'],
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      enum: ['VE', 'INR'],
      default: 'VE',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'gift',
    },
    isUltimateReward: {
      type: Boolean,
      default: false,
    },
    badgeText: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#8B5CF6',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StreakReward', streakRewardSchema);
