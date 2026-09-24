const User = require('../models/User');
const Wallet = require('../models/Wallet');
const StreakCycle = require('../models/StreakCycle');
const StreakClaim = require('../models/StreakClaim');
const StreakReward = require('../models/StreakReward');
const StreakConfig = require('../models/StreakConfig');
const AuditLog = require('../models/AuditLog');

/**
 * @route   GET /api/admin/overview
 * @desc    Get system-wide metrics and stats for admin dashboard
 * @access  Private / Admin
 */
const getOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeCycles = await StreakCycle.countDocuments({ status: 'ACTIVE' });
    const completedCycles = await StreakCycle.countDocuments({ status: 'COMPLETED' });
    const totalClaims = await StreakClaim.countDocuments();

    // Calculate total VEs distributed & Amazon Gift cards
    const wallets = await Wallet.find().select('veBalance totalVeEarned totalAmazonEarned amazonGiftCards');
    let totalVeCirculating = 0;
    let totalVeEarnedAllTime = 0;
    let totalAmazonCash = 0;
    let totalAmazonVouchers = 0;

    wallets.forEach((w) => {
      totalVeCirculating += w.veBalance || 0;
      totalVeEarnedAllTime += w.totalVeEarned || 0;
      totalAmazonCash += w.totalAmazonEarned || 0;
      totalAmazonVouchers += (w.amazonGiftCards && w.amazonGiftCards.length) || 0;
    });

    const recentClaims = await StreakClaim.find()
      .populate('userId', 'name email avatar')
      .sort({ claimedAt: -1 })
      .limit(6);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeCycles,
        completedCycles,
        totalClaims,
        totalVeCirculating,
        totalVeEarnedAllTime,
        totalAmazonCash,
        totalAmazonVouchers,
        recentClaims,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with wallet & streak progression
 * @access  Private / Admin
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    const enrichedUsers = await Promise.all(
      users.map(async (u) => {
        const wallet = await Wallet.findOne({ userId: u._id });
        const cycle = await StreakCycle.findOne({ userId: u._id, status: 'ACTIVE' });
        const claimsCount = await StreakClaim.countDocuments({ userId: u._id });

        return {
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          avatar: u.avatar,
          createdAt: u.createdAt,
          lastLoginAt: u.lastLoginAt,
          veBalance: wallet ? wallet.veBalance : 0,
          amazonVouchersCount: wallet ? wallet.amazonGiftCards.length : 0,
          currentStreak: cycle ? cycle.currentStreak : 0,
          totalClaims: claimsCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: enrichedUsers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/rewards
 * @desc    Get all 7 streak reward definitions from MongoDB
 * @access  Private / Admin
 */
const getRewards = async (req, res, next) => {
  try {
    const rewards = await StreakReward.find().sort({ dayNumber: 1 });
    const config = await StreakConfig.findOne({ isActive: true });

    return res.status(200).json({
      success: true,
      data: {
        rewards,
        config,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/admin/rewards/:id
 * @desc    Update reward value or title in MongoDB
 * @access  Private / Admin
 */
const updateReward = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, value, rewardType, currency, description, badgeText } = req.body;

    const reward = await StreakReward.findById(id);
    if (!reward) {
      return res.status(404).json({ success: false, message: 'Reward not found' });
    }

    if (title !== undefined) reward.title = title;
    if (value !== undefined) reward.value = Number(value);
    if (rewardType !== undefined) reward.rewardType = rewardType;
    if (currency !== undefined) reward.currency = currency;
    if (description !== undefined) reward.description = description;
    if (badgeText !== undefined) reward.badgeText = badgeText;

    await reward.save();

    return res.status(200).json({
      success: true,
      message: `Day ${reward.dayNumber} reward updated successfully!`,
      data: reward,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/claims
 * @desc    Get global streak claims
 * @access  Private / Admin
 */
const getClaims = async (req, res, next) => {
  try {
    const claims = await StreakClaim.find()
      .populate('userId', 'name email avatar')
      .sort({ claimedAt: -1 })
      .limit(30);

    return res.status(200).json({
      success: true,
      data: claims,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/audit-logs
 * @desc    Get system audit logs
 * @access  Private / Admin
 */
const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  getUsers,
  getRewards,
  updateReward,
  getClaims,
  getAuditLogs,
};
