const StreakReward = require('../models/StreakReward');
const StreakCycle = require('../models/StreakCycle');
const StreakClaim = require('../models/StreakClaim');
const StreakConfig = require('../models/StreakConfig');
const { creditStreakReward, getOrCreateWallet } = require('./walletService');
const { logAudit } = require('./auditService');

// In-memory mutex per user to prevent concurrent race condition claims (e.g. multiple tabs / double clicks)
const userClaimLocks = new Set();

/**
 * Get active StreakConfig (or create default)
 */
const getActiveConfig = async () => {
  let config = await StreakConfig.findOne({ isActive: true });
  if (!config) {
    config = await StreakConfig.create({
      name: 'default_7_day_cycle',
      cycleLength: 7,
      cooldownHours: 24,
      missedWindowHours: 48,
      cpaRequired: true,
      isActive: true,
    });
  }
  return config;
};

/**
 * Fetch or initialize active streak cycle for user
 * Checks for missed-day window and resets streak if expired
 */
const getOrCreateActiveCycle = async (userId) => {
  const config = await getActiveConfig();
  const now = new Date();

  // Find user's currently active cycle
  let cycle = await StreakCycle.findOne({
    userId,
    status: 'ACTIVE',
  }).sort({ cycleNumber: -1 });

  // If no active cycle, create cycle #1
  if (!cycle) {
    const latestCycle = await StreakCycle.findOne({ userId }).sort({ cycleNumber: -1 });
    const nextCycleNumber = latestCycle ? latestCycle.cycleNumber + 1 : 1;

    cycle = await StreakCycle.create({
      userId,
      cycleNumber: nextCycleNumber,
      status: 'ACTIVE',
      currentStreak: 0,
      lastClaimAt: null,
      nextClaimAt: now, // Can claim Day 1 right away
      claimWindowExpiresAt: null,
    });

    await logAudit({
      userId,
      action: 'CYCLE_INITIALIZED',
      metadata: { cycleNumber: nextCycleNumber },
      status: 'SUCCESS',
    });

    return cycle;
  }

  // Check if user MISSED the claim window
  // Only applies if the user has already claimed at least 1 day in this cycle
  if (cycle.currentStreak > 0 && cycle.claimWindowExpiresAt) {
    if (now > cycle.claimWindowExpiresAt) {
      // Feature 1: Streak Freeze Shield gamification
      if (cycle.hasFreeze) {
        cycle.hasFreeze = false;
        // Extend the window so the user gets a second chance to check in
        cycle.nextClaimAt = now;
        cycle.claimWindowExpiresAt = new Date(now.getTime() + (config.missedWindowHours || 48) * 3600 * 1000);
        await cycle.save();

        await logAudit({
          userId,
          action: 'STREAK_FREEZE_CONSUMED',
          metadata: {
            cycleId: cycle._id,
            streakPreserved: cycle.currentStreak,
            extendedUntil: cycle.claimWindowExpiresAt,
            serverTime: now,
          },
          status: 'SUCCESS',
        });

        return cycle;
      }

      // User missed the window and has no freeze shield! Streak resets back to Day 1
      cycle.status = 'BROKEN';
      await cycle.save();

      await logAudit({
        userId,
        action: 'STREAK_RESET_MISSED_DAY',
        metadata: {
          brokenCycleId: cycle._id,
          previousStreak: cycle.currentStreak,
          missedWindowAt: cycle.claimWindowExpiresAt,
          serverTime: now,
        },
        status: 'WARNING',
      });

      // Start a brand new cycle at Day 1
      const nextCycleNumber = cycle.cycleNumber + 1;
      cycle = await StreakCycle.create({
        userId,
        cycleNumber: nextCycleNumber,
        status: 'ACTIVE',
        currentStreak: 0,
        lastClaimAt: null,
        nextClaimAt: now, // Day 1 is available immediately
        claimWindowExpiresAt: null,
        hasFreeze: false,
      });

      return cycle;
    }
  }

  return cycle;
};

/**
 * Build complete daily streak dashboard data
 */
const getStreakDashboardData = async (userId) => {
  const config = await getActiveConfig();
  const cycle = await getOrCreateActiveCycle(userId);
  const now = new Date();

  // Fetch all 7 rewards ordered by dayNumber
  const rewards = await StreakReward.find({ isActive: true }).sort({ dayNumber: 1 });

  // Fetch all claims for this active cycle
  const claims = await StreakClaim.find({
    userId,
    cycleId: cycle._id,
  }).sort({ dayNumber: 1 });

  const claimedDaySet = new Set(claims.map((c) => c.dayNumber));

  // Determine current day target (1 to 7)
  const currentStreak = cycle.currentStreak;
  const nextEligibleDay = currentStreak < config.cycleLength ? currentStreak + 1 : 1;

  // Determine if user can claim right now
  let canClaim = false;
  let remainingCooldownMs = 0;
  let remainingWindowMs = 0;

  if (currentStreak === 0) {
    // Brand new cycle or after reset: Day 1 is immediately available!
    canClaim = true;
  } else {
    // If cooldown has elapsed and window has not expired
    const cooldownTime = cycle.nextClaimAt ? new Date(cycle.nextClaimAt).getTime() : 0;
    const nowTime = now.getTime();

    if (nowTime >= cooldownTime) {
      canClaim = true;
    } else {
      canClaim = false;
      remainingCooldownMs = Math.max(0, cooldownTime - nowTime);
    }

    if (cycle.claimWindowExpiresAt) {
      remainingWindowMs = Math.max(0, new Date(cycle.claimWindowExpiresAt).getTime() - nowTime);
    }
  }

  // Calculate card states for each day (1 to 7)
  const days = rewards.map((reward) => {
    const dayNum = reward.dayNumber;
    let state = 'LOCKED'; // Default state

    if (claimedDaySet.has(dayNum)) {
      state = 'CLAIMED';
    } else if (dayNum === nextEligibleDay) {
      if (canClaim) {
        state = 'AVAILABLE';
      } else {
        state = 'TODAY'; // It is today's target day, but cooldown is active
      }
    } else if (dayNum < nextEligibleDay) {
      state = 'MISSED';
    } else {
      state = 'LOCKED';
    }

    return {
      dayNumber: reward.dayNumber,
      title: reward.title,
      description: reward.description,
      rewardType: reward.rewardType,
      value: reward.value,
      currency: reward.currency,
      icon: reward.icon,
      isUltimateReward: reward.isUltimateReward,
      badgeText: reward.badgeText,
      color: reward.color,
      state,
      isCurrentDay: dayNum === nextEligibleDay,
    };
  });

  // Calculate statistics
  const totalClaimsCount = await StreakClaim.countDocuments({ userId });
  const completedCyclesCount = await StreakCycle.countDocuments({
    userId,
    status: 'COMPLETED',
  });

  // Next reward info
  const nextRewardObj = rewards.find((r) => r.dayNumber === nextEligibleDay) || rewards[0];

  return {
    serverTime: now,
    cycle: {
      id: cycle._id,
      cycleNumber: cycle.cycleNumber,
      status: cycle.status,
      currentStreak: cycle.currentStreak,
      lastClaimAt: cycle.lastClaimAt,
      nextClaimAt: cycle.nextClaimAt,
      claimWindowExpiresAt: cycle.claimWindowExpiresAt,
      hasFreeze: cycle.hasFreeze || false,
    },
    config: {
      cycleLength: config.cycleLength,
      cooldownHours: config.cooldownHours,
      missedWindowHours: config.missedWindowHours,
      cpaRequired: config.cpaRequired,
    },
    eligibility: {
      canClaim,
      currentDay: nextEligibleDay,
      remainingCooldownMs,
      remainingWindowMs,
      hasFreeze: cycle.hasFreeze || false,
    },
    stats: {
      currentStreak: cycle.currentStreak,
      totalRewardsClaimed: totalClaimsCount,
      completedCycles: completedCyclesCount,
      nextReward: {
        day: nextEligibleDay,
        value: nextRewardObj.value,
        currency: nextRewardObj.currency,
        title: nextRewardObj.title,
        rewardType: nextRewardObj.rewardType,
      },
    },
    days,
  };
};

/**
 * Claim daily streak reward with strict validations, CPA check & atomic locks
 */
const claimDailyReward = async ({ userId, cpaToken, cpaEngagementSeconds = 3, ipAddress = '', userAgent = '' }) => {
  // 1. Prevent concurrent clicks from same user
  const lockKey = userId.toString();
  if (userClaimLocks.has(lockKey)) {
    const error = new Error('A claim request is already in progress. Please wait a moment.');
    error.statusCode = 429;
    error.code = 'CONCURRENT_REQUEST';
    throw error;
  }

  userClaimLocks.add(lockKey);

  try {
    const now = new Date();
    const config = await getActiveConfig();

    // 2. Fetch or reset active cycle
    const cycle = await getOrCreateActiveCycle(userId);

    // 3. Determine target day
    const targetDayNumber = cycle.currentStreak + 1;
    if (targetDayNumber > config.cycleLength) {
      const error = new Error('You have already completed this 7-day streak cycle!');
      error.statusCode = 400;
      error.code = 'CYCLE_ALREADY_COMPLETED';
      throw error;
    }

    // 4. Verify cooldown eligibility
    if (cycle.lastClaimAt && cycle.nextClaimAt) {
      if (now < new Date(cycle.nextClaimAt)) {
        const diffMs = new Date(cycle.nextClaimAt).getTime() - now.getTime();
        const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
        const error = new Error(
          `Your next reward is still locked. Please wait until the cooldown timer expires (in ~${diffHours}h).`
        );
        error.statusCode = 400;
        error.code = 'REWARD_LOCKED';
        throw error;
      }
    }

    // 5. Verify reward configuration from MongoDB (NEVER trust frontend reward data)
    const reward = await StreakReward.findOne({
      dayNumber: targetDayNumber,
      isActive: true,
    });

    if (!reward) {
      const error = new Error(`Configuration for Day ${targetDayNumber} reward was not found in the database.`);
      error.statusCode = 500;
      error.code = 'REWARD_CONFIG_MISSING';
      throw error;
    }

    // 6. Check if already claimed in this cycle (duplicate claim prevention)
    const existingClaim = await StreakClaim.findOne({
      userId,
      cycleId: cycle._id,
      dayNumber: targetDayNumber,
    });

    if (existingClaim) {
      const error = new Error('You have already claimed this daily reward!');
      error.statusCode = 400;
      error.code = 'ALREADY_CLAIMED';
      throw error;
    }

    // 7. CPA Demo Verification check
    let cpaStatus = 'VERIFIED';
    if (config.cpaRequired) {
      // In production, verify token with CPA provider; in our CPA Demo flow, token is signed or verified
      if (!cpaToken || cpaToken === 'failed') {
        const error = new Error('Partner verification was not completed. Please try the verification step again.');
        error.statusCode = 400;
        error.code = 'CPA_VERIFICATION_FAILED';
        throw error;
      }
    }

    // 8. Create StreakClaim record
    const streakClaim = await StreakClaim.create({
      userId,
      cycleId: cycle._id,
      cycleNumber: cycle.cycleNumber,
      dayNumber: targetDayNumber,
      rewardId: reward._id,
      rewardSnapshot: {
        rewardType: reward.rewardType,
        value: reward.value,
        currency: reward.currency,
        title: reward.title,
      },
      cpaStatus,
      cpaEngagementSeconds,
      ipAddress,
      userAgent,
      claimedAt: now,
    });

    // 9. Credit Wallet & Create WalletTransaction
    const { wallet, giftCardCode, transaction } = await creditStreakReward({
      userId,
      reward,
      claimId: streakClaim._id,
    });

    if (giftCardCode) {
      streakClaim.giftCardCode = giftCardCode;
      await streakClaim.save();
    }

    // 10. Update StreakCycle
    const nextStreakCount = cycle.currentStreak + 1;
    const cooldownMs = config.cooldownHours * 60 * 60 * 1000;
    const missedWindowMs = config.missedWindowHours * 60 * 60 * 1000;

    cycle.currentStreak = nextStreakCount;
    cycle.lastClaimAt = now;
    cycle.nextClaimAt = new Date(now.getTime() + cooldownMs);
    cycle.claimWindowExpiresAt = new Date(now.getTime() + missedWindowMs);

    let isCycleCompleted = false;
    if (nextStreakCount >= config.cycleLength) {
      cycle.status = 'COMPLETED';
      cycle.completedAt = now;
      isCycleCompleted = true;
    }

    await cycle.save();

    // 11. Audit Log
    await logAudit({
      userId,
      action: 'REWARD_CLAIMED',
      metadata: {
        cycleId: cycle._id,
        dayNumber: targetDayNumber,
        rewardValue: reward.value,
        rewardType: reward.rewardType,
        isCycleCompleted,
      },
      ipAddress,
      userAgent,
      status: 'SUCCESS',
    });

    // 12. Return updated state
    const updatedDashboard = await getStreakDashboardData(userId);

    return {
      success: true,
      message: `Congratulations! Day ${targetDayNumber} reward claimed successfully!`,
      claimedReward: {
        dayNumber: targetDayNumber,
        title: reward.title,
        value: reward.value,
        rewardType: reward.rewardType,
        currency: reward.currency,
        giftCardCode,
        isUltimateReward: reward.isUltimateReward,
      },
      wallet: {
        veBalance: wallet.veBalance,
        totalVeEarned: wallet.totalVeEarned,
        totalAmazonEarned: wallet.totalAmazonEarned,
      },
      dashboard: updatedDashboard,
    };
  } finally {
    // Release in-memory user lock
    userClaimLocks.delete(lockKey);
  }
};

/**
 * Dev Helper: Advance simulated day cooldown for testing all 7 days seamlessly
 */
const devAdvanceDay = async (userId) => {
  const cycle = await StreakCycle.findOne({ userId, status: 'ACTIVE' }).sort({ cycleNumber: -1 });
  if (!cycle) {
    throw new Error('No active cycle found');
  }

  // Set nextClaimAt to the past so next day is immediately available!
  const pastTime = new Date(Date.now() - 1000);
  cycle.nextClaimAt = pastTime;
  // Ensure missedWindow is still in the future
  cycle.claimWindowExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await cycle.save();

  return await getStreakDashboardData(userId);
};

/**
 * Dev Helper: Simulate a missed day to test automatic streak reset
 */
const devSimulateMissedDay = async (userId) => {
  const cycle = await StreakCycle.findOne({ userId, status: 'ACTIVE' }).sort({ cycleNumber: -1 });
  if (!cycle) {
    throw new Error('No active cycle found');
  }

  // Force claimWindowExpiresAt into the past
  cycle.claimWindowExpiresAt = new Date(Date.now() - 60 * 1000);
  await cycle.save();

  // Trigger cycle evaluation which will reset to Day 1
  return await getStreakDashboardData(userId);
};

/**
 * Feature 1: Purchase Streak Freeze Shield
 * Deducts 50 VEs from user's wallet, activates hasFreeze on active cycle
 */
const buyStreakFreeze = async (userId) => {
  const wallet = await getOrCreateWallet(userId);
  const cycle = await getOrCreateActiveCycle(userId);

  // Check if freeze is already active
  if (cycle.hasFreeze) {
    const error = new Error('Streak Freeze is already active for your current streak!');
    error.statusCode = 400;
    throw error;
  }

  // Check if user has at least 50 VEs
  if (wallet.veBalance < 50) {
    const error = new Error('Insufficient VE coins. You need 50 VEs to purchase a Streak Freeze Shield.');
    error.statusCode = 400;
    throw error;
  }

  // Deduct 50 VEs
  wallet.veBalance -= 50;
  await wallet.save();

  // Activate freeze on streak cycle
  cycle.hasFreeze = true;
  await cycle.save();

  // Log in transaction history
  const WalletTransaction = require('../models/WalletTransaction');
  await WalletTransaction.create({
    userId,
    walletId: wallet._id,
    type: 'DEBIT',
    category: 'STREAK_FREEZE',
    amount: 50,
    currency: 'VE',
    description: 'Purchased Streak Freeze Shield (50 VEs)',
    balanceAfter: wallet.veBalance,
    metadata: { cycleId: cycle._id },
  });

  // Log audit
  await logAudit({
    userId,
    action: 'STREAK_FREEZE_PURCHASED',
    metadata: {
      cost: 50,
      remainingBalance: wallet.veBalance,
      cycleId: cycle._id,
    },
    status: 'SUCCESS',
  });

  return {
    success: true,
    message: 'Streak Freeze Shield activated! Your streak is protected from 1 missed check-in.',
    hasFreeze: true,
    veBalance: wallet.veBalance,
    cycle: {
      id: cycle._id,
      currentStreak: cycle.currentStreak,
      hasFreeze: true,
    },
  };
};

module.exports = {
  getStreakDashboardData,
  claimDailyReward,
  devAdvanceDay,
  devSimulateMissedDay,
  getActiveConfig,
  buyStreakFreeze,
};
