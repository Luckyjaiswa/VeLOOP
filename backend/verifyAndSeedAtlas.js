require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');

// Import all 8 models
const User = require('./src/models/User');
const Wallet = require('./src/models/Wallet');
const StreakConfig = require('./src/models/StreakConfig');
const StreakReward = require('./src/models/StreakReward');
const StreakCycle = require('./src/models/StreakCycle');
const StreakClaim = require('./src/models/StreakClaim');
const WalletTransaction = require('./src/models/WalletTransaction');
const AuditLog = require('./src/models/AuditLog');

const { DEFAULT_REWARDS } = require('./src/utils/seedData');

const seedAndVerifyAtlas = async () => {
  try {
    console.log('\n=============================================================');
    console.log('🔄 CONNECTING TO MONGODB ATLAS & VERIFYING COLLECTIONS...');
    console.log('=============================================================\n');

    await connectDB();

    console.log('[1/7] Seeding Streak Configuration & 7-Day Rewards...');
    await StreakReward.deleteMany({});
    await StreakReward.insertMany(DEFAULT_REWARDS);

    await StreakConfig.findOneAndUpdate(
      { name: 'default_7_day_cycle' },
      {
        name: 'default_7_day_cycle',
        cycleLength: 7,
        cooldownHours: 24,
        missedWindowHours: 48,
        cpaRequired: true,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    console.log('[2/7] Creating Verified Users in Atlas...');
    // Demo user 1: Alex Rivera
    let user1 = await User.findOne({ email: 'demo@veloop.com' });
    if (!user1) {
      user1 = await User.create({
        name: 'Alex Rivera',
        email: 'demo@veloop.com',
        password: 'Password123!',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        role: 'user',
      });
    }

    // Demo user 2: Lucky Jai
    let user2 = await User.findOne({ email: 'luckyjai898@veloop.com' });
    if (!user2) {
      user2 = await User.create({
        name: 'Lucky Jai',
        email: 'luckyjai898@veloop.com',
        password: 'Password123!',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'admin',
      });
    }

    console.log('[3/7] Setting Up Streak Cycles...');
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    // Active cycle for user1
    await StreakCycle.deleteMany({ userId: { $in: [user1._id, user2._id] } });
    const cycle1 = await StreakCycle.create({
      userId: user1._id,
      cycleNumber: 1,
      status: 'ACTIVE',
      currentStreak: 2,
      lastClaimAt: yesterday,
      nextClaimAt: now, // Day 3 ready to claim
      claimWindowExpiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    });

    const cycle2 = await StreakCycle.create({
      userId: user2._id,
      cycleNumber: 1,
      status: 'ACTIVE',
      currentStreak: 0,
      lastClaimAt: null,
      nextClaimAt: now, // Day 1 ready to claim
      claimWindowExpiresAt: null,
    });

    console.log('[4/7] Creating Historical Claims & Vouchers...');
    await StreakClaim.deleteMany({ userId: { $in: [user1._id, user2._id] } });

    // Find reward 1 and reward 2
    const reward1 = await StreakReward.findOne({ dayNumber: 1 });
    const reward2 = await StreakReward.findOne({ dayNumber: 2 });
    const reward4 = await StreakReward.findOne({ dayNumber: 4 });

    const claim1 = await StreakClaim.create({
      userId: user1._id,
      cycleId: cycle1._id,
      cycleNumber: 1,
      dayNumber: 1,
      rewardId: reward1._id,
      rewardSnapshot: {
        rewardType: reward1.rewardType,
        value: reward1.value,
        currency: reward1.currency,
        title: reward1.title,
      },
      cpaStatus: 'VERIFIED',
      cpaEngagementSeconds: 3,
      claimedAt: twoDaysAgo,
    });

    const claim2 = await StreakClaim.create({
      userId: user1._id,
      cycleId: cycle1._id,
      cycleNumber: 1,
      dayNumber: 2,
      rewardId: reward2._id,
      rewardSnapshot: {
        rewardType: reward2.rewardType,
        value: reward2.value,
        currency: reward2.currency,
        title: reward2.title,
      },
      cpaStatus: 'VERIFIED',
      cpaEngagementSeconds: 3,
      claimedAt: yesterday,
    });

    console.log('[5/7] Creating Wallets with VE Coins and Amazon Gift Card Vouchers...');
    await Wallet.deleteMany({ userId: { $in: [user1._id, user2._id] } });

    const sampleGiftCards = [
      {
        code: 'AMZ-VELP-7X9B-4K1L',
        amount: 1,
        currency: 'INR',
        claimId: claim2._id,
        claimedAt: yesterday,
        isRedeemed: false,
        pin: '4829',
      },
      {
        code: 'AMZ-VELP-9932-5510',
        amount: 2,
        currency: 'INR',
        claimId: claim2._id,
        claimedAt: now,
        isRedeemed: false,
        pin: '9182',
      },
    ];

    const wallet1 = await Wallet.create({
      userId: user1._id,
      veBalance: 65, // 50 starter + 5 (Day 1) + 10 (Day 2)
      totalVeEarned: 65,
      amazonGiftCards: sampleGiftCards,
      totalAmazonEarned: 3,
    });

    const wallet2 = await Wallet.create({
      userId: user2._id,
      veBalance: 50,
      totalVeEarned: 50,
      amazonGiftCards: [],
      totalAmazonEarned: 0,
    });

    console.log('[6/7] Creating Wallet Ledger Transactions...');
    await WalletTransaction.deleteMany({ userId: { $in: [user1._id, user2._id] } });

    await WalletTransaction.create([
      {
        userId: user1._id,
        walletId: wallet1._id,
        type: 'CREDIT',
        category: 'BONUS',
        amount: 50,
        currency: 'VE',
        description: 'Starter Welcome Bonus VEs',
        balanceAfter: 50,
        createdAt: twoDaysAgo,
      },
      {
        userId: user1._id,
        walletId: wallet1._id,
        type: 'CREDIT',
        category: 'DAILY_STREAK_REWARD',
        amount: 5,
        currency: 'VE',
        description: 'Daily Streak Day 1 reward: +5 VEs',
        referenceId: claim1._id,
        balanceAfter: 55,
        createdAt: twoDaysAgo,
      },
      {
        userId: user1._id,
        walletId: wallet1._id,
        type: 'CREDIT',
        category: 'DAILY_STREAK_REWARD',
        amount: 10,
        currency: 'VE',
        description: 'Daily Streak Day 2 reward: +10 VEs',
        referenceId: claim2._id,
        balanceAfter: 65,
        createdAt: yesterday,
      },
    ]);

    console.log('[7/7] Creating Audit Logs in Atlas...');
    await AuditLog.create([
      {
        userId: user1._id,
        action: 'USER_REGISTER',
        metadata: { email: user1.email },
        status: 'SUCCESS',
      },
      {
        userId: user1._id,
        action: 'REWARD_CLAIMED',
        metadata: { dayNumber: 1, value: 5, rewardType: 'VE' },
        status: 'SUCCESS',
      },
      {
        userId: user1._id,
        action: 'REWARD_CLAIMED',
        metadata: { dayNumber: 2, value: 10, rewardType: 'VE' },
        status: 'SUCCESS',
      },
    ]);

    // Query back live statistics from Atlas to confirm
    console.log('\n=============================================================');
    console.log('📊 LIVE MONGODB ATLAS VERIFICATION SUMMARY:');
    console.log('=============================================================');

    const counts = {
      Users: await User.countDocuments(),
      Wallets: await Wallet.countDocuments(),
      StreakRewards: await StreakReward.countDocuments(),
      StreakConfigs: await StreakConfig.countDocuments(),
      StreakCycles: await StreakCycle.countDocuments(),
      StreakClaims: await StreakClaim.countDocuments(),
      WalletTransactions: await WalletTransaction.countDocuments(),
      AuditLogs: await AuditLog.countDocuments(),
    };

    console.table(counts);

    console.log('-------------------------------------------------------------');
    console.log('👤 Sample Users Stored in Atlas:');
    const users = await User.find().select('name email role createdAt');
    console.table(
      users.map((u) => ({
        ID: u._id.toString(),
        Name: u.name,
        Email: u.email,
        Role: u.role,
      }))
    );

    console.log('🎁 7-Day Rewards Stored in Atlas:');
    const rewards = await StreakReward.find().sort({ dayNumber: 1 });
    console.table(
      rewards.map((r) => ({
        Day: `Day ${r.dayNumber}`,
        Title: r.title,
        Type: r.rewardType,
        Value: `${r.value} ${r.currency}`,
        IsUltimate: r.isUltimateReward ? '★ YES' : 'No',
      }))
    );

    console.log('💳 User 1 Wallet & Amazon Gift Cards Stored in Atlas:');
    const w1 = await Wallet.findOne({ userId: user1._id });
    console.log(`   - VE Coins Balance: ${w1.veBalance} VEs`);
    console.log(`   - Total Amazon Cash: ₹${w1.totalAmazonEarned} INR`);
    console.log(`   - Vouchers Count: ${w1.amazonGiftCards.length}`);
    w1.amazonGiftCards.forEach((gc, idx) => {
      console.log(`     [${idx + 1}] Voucher: ${gc.code} (₹${gc.amount} ${gc.currency}) | PIN: ${gc.pin}`);
    });

    console.log('\n=============================================================');
    console.log('✅ ALL DATA HAS BEEN SUCCESSFULLY VERIFIED IN MONGODB ATLAS!');
    console.log('=============================================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Verification Error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedAndVerifyAtlas();
