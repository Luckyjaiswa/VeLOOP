const mongoose = require('mongoose');

const streakConfigSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      default: 'default_7_day_cycle',
    },
    cycleLength: {
      type: Number,
      default: 7,
      min: 1,
      max: 30,
    },
    cooldownHours: {
      type: Number,
      default: 24,
      min: 0,
    },
    missedWindowHours: {
      type: Number,
      default: 48,
      min: 1,
    },
    cpaRequired: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: 'Standard 7-Day VELoop Rewards Consecutive Streak Cycle',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StreakConfig', streakConfigSchema);
