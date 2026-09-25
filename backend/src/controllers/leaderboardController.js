const User = require('../models/User');
const Wallet = require('../models/Wallet');
const StreakCycle = require('../models/StreakCycle');

/**
 * Helper to compute 2-character user initials
 */
const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'VE';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

/**
 * @route   GET /api/leaderboard
 * @desc    Get top 10 users ranked by activeStreak (DESC) and walletVEs (DESC)
 *          along with the current logged-in user's global rank & stats
 * @access  Public / Private (Enriched with user rank if authenticated)
 */
const getLeaderboard = async (req, res, next) => {
  try {
    // 1. Fetch all active users
    const users = await User.find({ isActive: { $ne: false } })
      .select('name email avatar role createdAt')
      .lean();

    // 2. Fetch active streak cycle and wallet data for each user
    const enrichedUsers = await Promise.all(
      users.map(async (u) => {
        const [wallet, cycle] = await Promise.all([
          Wallet.findOne({ userId: u._id }).lean(),
          StreakCycle.findOne({ userId: u._id, status: 'ACTIVE' })
            .sort({ cycleNumber: -1 })
            .lean(),
        ]);

        return {
          id: u._id.toString(),
          name: u.name,
          email: u.email,
          initials: getInitials(u.name),
          avatar:
            u.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          role: u.role,
          activeStreak: cycle ? cycle.currentStreak : 0,
          walletVEs: wallet ? wallet.veBalance : 0,
          totalVeEarned: wallet ? wallet.totalVeEarned : 0,
          createdAt: u.createdAt,
        };
      })
    );

    // 3. Sort users: Primary: activeStreak (DESC), Secondary: walletVEs (DESC), Tertiary: totalVeEarned (DESC)
    enrichedUsers.sort((a, b) => {
      if (b.activeStreak !== a.activeStreak) {
        return b.activeStreak - a.activeStreak;
      }
      if (b.walletVEs !== a.walletVEs) {
        return b.walletVEs - a.walletVEs;
      }
      if (b.totalVeEarned !== a.totalVeEarned) {
        return b.totalVeEarned - a.totalVeEarned;
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    const currentUserIdStr = req.user ? req.user._id.toString() : null;

    // 4. Assign global rank numbers and top-3 badge metadata
    const rankedUsers = enrichedUsers.map((user, index) => {
      const rank = index + 1;
      let badge = null;
      if (rank === 1) badge = 'gold';
      else if (rank === 2) badge = 'silver';
      else if (rank === 3) badge = 'bronze';

      return {
        ...user,
        rank,
        badge,
        isCurrentUser: currentUserIdStr ? user.id === currentUserIdStr : false,
      };
    });

    // 5. Extract top 10 users for the main leaderboard
    const topUsers = rankedUsers.slice(0, 10);

    // 6. Find current user's global ranking and stats (even if outside top 10)
    let currentUserStats = null;
    if (currentUserIdStr) {
      const found = rankedUsers.find((u) => u.id === currentUserIdStr);
      if (found) {
        currentUserStats = {
          rank: found.rank,
          id: found.id,
          name: found.name,
          initials: found.initials,
          avatar: found.avatar,
          activeStreak: found.activeStreak,
          walletVEs: found.walletVEs,
          totalVeEarned: found.totalVeEarned,
          badge: found.badge,
          isTop10: found.rank <= 10,
        };
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        topUsers,
        currentUser: currentUserStats,
        totalUsers: rankedUsers.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeaderboard,
};
