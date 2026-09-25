const mongoose = require('mongoose');

const streakCycleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    cycleNumber: {
      type: Number,
      required: true,
      default: 1,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED', 'BROKEN'],
      default: 'ACTIVE',
      index: true,
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
      max: 7,
    },
    lastClaimAt: {
      type: Date,
      default: null,
    },
    nextClaimAt: {
      type: Date,
      default: null,
    },
    claimWindowExpiresAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    hasFreeze: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

streakCycleSchema.index({ userId: 1, cycleNumber: 1 }, { unique: true });

module.exports = mongoose.model('StreakCycle', streakCycleSchema);
