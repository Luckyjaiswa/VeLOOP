const StreakClaim = require('../models/StreakClaim');
const {
  getStreakDashboardData,
  claimDailyReward,
  devAdvanceDay,
  devSimulateMissedDay,
  buyStreakFreeze,
} = require('../services/streakService');

/**
 * @route   GET /api/daily-streak
 * @desc    Get full streak dashboard data (rewards, states, countdown, stats)
 * @access  Private
 */
const getDailyStreak = async (req, res, next) => {
  try {
    const data = await getStreakDashboardData(req.user._id);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/daily-streak/status
 * @desc    Lightweight endpoint for frontend timer verification & eligibility check
 * @access  Private
 */
const getStreakStatus = async (req, res, next) => {
  try {
    const data = await getStreakDashboardData(req.user._id);
    return res.status(200).json({
      success: true,
      serverTime: data.serverTime,
      canClaim: data.eligibility.canClaim,
      currentStreak: data.cycle.currentStreak,
      currentDay: data.eligibility.currentDay,
      nextClaimAt: data.cycle.nextClaimAt,
      claimWindowExpiresAt: data.cycle.claimWindowExpiresAt,
      remainingCooldownMs: data.eligibility.remainingCooldownMs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/daily-streak/claim
 * @desc    Claim current day streak reward
 * @access  Private
 */
const claimReward = async (req, res, next) => {
  try {
    const { cpaToken, cpaEngagementSeconds } = req.body;

    const result = await claimDailyReward({
      userId: req.user._id,
      cpaToken: cpaToken || 'demo_cpa_verified',
      cpaEngagementSeconds: cpaEngagementSeconds || 3,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || '',
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/daily-streak/history
 * @desc    Get user's past streak reward claims
 * @access  Private
 */
const getStreakHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;

    const total = await StreakClaim.countDocuments({ userId: req.user._id });
    const claims = await StreakClaim.find({ userId: req.user._id })
      .populate('rewardId', 'title description icon badgeText color')
      .sort({ claimedAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: claims.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      data: claims,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/daily-streak/dev-advance-day
 * @desc    Dev helper: fast-forward cooldown to test Days 1 through 7 consecutively
 * @access  Private (Development helper)
 */
const handleDevAdvanceDay = async (req, res, next) => {
  try {
    const updatedDashboard = await devAdvanceDay(req.user._id);
    return res.status(200).json({
      success: true,
      message: 'Dev: Cooldown bypassed! Next streak day is now available to claim.',
      data: updatedDashboard,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/daily-streak/dev-simulate-missed
 * @desc    Dev helper: simulate a missed 48h window to test streak reset to Day 1
 * @access  Private (Development helper)
 */
const handleDevSimulateMissed = async (req, res, next) => {
  try {
    const updatedDashboard = await devSimulateMissedDay(req.user._id);
    return res.status(200).json({
      success: true,
      message: 'Dev: Missed-day window expired! Streak has been reset back to Day 1.',
      data: updatedDashboard,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/streak/buy-freeze or /api/daily-streak/buy-freeze
 * @desc    Purchase Streak Freeze Shield (50 VEs)
 * @access  Private
 */
const handleBuyFreeze = async (req, res, next) => {
  try {
    const result = await buyStreakFreeze(req.user._id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDailyStreak,
  getStreakStatus,
  claimReward,
  getStreakHistory,
  handleDevAdvanceDay,
  handleDevSimulateMissed,
  handleBuyFreeze,
};
