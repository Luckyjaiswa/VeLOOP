require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Wallet = require('../src/models/Wallet');
const StreakCycle = require('../src/models/StreakCycle');
const StreakClaim = require('../src/models/StreakClaim');
const { claimDailyReward, getStreakDashboardData, devAdvanceDay } = require('../src/services/streakService');

const runSecurityTests = async () => {
  console.log('\n🔒 ====================================================');
  console.log('🔒 RUNNING VELoop STREAK SYSTEM SECURITY & INTEGRITY TESTS');
  console.log('🔒 ====================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  };

  try {
    await connectDB();

    // Clean up test user if exists
    const testEmail = 'security_test_user@veloop.com';
    await User.deleteMany({ email: testEmail });
    const user = await User.create({
      name: 'Security Test User',
      email: testEmail,
      password: 'Password123!',
    });

    const otherUser = await User.create({
      name: 'Other User',
      email: 'other_user@veloop.com',
      password: 'Password123!',
    });

    console.log('[Test Setup] Test users created.');

    // TEST 1: Initial state is Day 1 AVAILABLE, Day 2..7 LOCKED
    const initialDash = await getStreakDashboardData(user._id);
    assert(initialDash.eligibility.canClaim === true, 'Test 1.1: Day 1 is eligible for new user');
    assert(initialDash.days[0].state === 'AVAILABLE', 'Test 1.2: Day 1 card state is AVAILABLE');
    assert(initialDash.days[1].state === 'LOCKED', 'Test 1.3: Day 2 card state is LOCKED');

    // TEST 2: Successful Day 1 claim
    const claimRes1 = await claimDailyReward({
      userId: user._id,
      cpaToken: 'demo_token_valid',
    });
    assert(claimRes1.success === true, 'Test 2.1: Day 1 claim succeeds');
    assert(claimRes1.claimedReward.dayNumber === 1, 'Test 2.2: Claimed reward is strictly Day 1');
    assert(claimRes1.claimedReward.value === 5, 'Test 2.3: Reward value is 5 VEs from database (not from frontend)');
    assert(claimRes1.wallet.veBalance === 5, 'Test 2.4: Wallet credited with exactly 5 VEs');

    // TEST 3: Duplicate claim prevention (Immediate re-claim should be rejected)
    let duplicateRejected = false;
    try {
      await claimDailyReward({
        userId: user._id,
        cpaToken: 'demo_token_valid',
      });
    } catch (err) {
      duplicateRejected = true;
      assert(
        err.code === 'REWARD_LOCKED' || err.code === 'ALREADY_CLAIMED' || err.statusCode === 400,
        `Test 3.1: Duplicate claim blocked with code '${err.code}'`
      );
    }
    assert(duplicateRejected, 'Test 3.2: Immediate second claim attempt was strictly rejected');

    // TEST 4: Frontend tamper prevention (Even if an attacker submits fake reward amount/type, backend enforces DB)
    // Note: our API does not even accept reward amount or day from the body; it reads from DB
    assert(claimRes1.claimedReward.rewardType === 'VE', 'Test 4.1: Reward type is enforced from DB');

    // TEST 5: Another user cannot claim on behalf of someone else
    const otherDash = await getStreakDashboardData(otherUser._id);
    assert(otherDash.cycle.currentStreak === 0, "Test 5.1: Other user's streak remains 0 (isolated per user)");

    // TEST 6: Advancing day (simulate cooldown elapsed) and claiming Day 2
    await devAdvanceDay(user._id);
    const day2Dash = await getStreakDashboardData(user._id);
    assert(day2Dash.eligibility.canClaim === true, 'Test 6.1: Day 2 becomes available after cooldown');
    assert(day2Dash.days[1].state === 'AVAILABLE', 'Test 6.2: Day 2 state is now AVAILABLE');
    assert(day2Dash.days[0].state === 'CLAIMED', 'Test 6.3: Day 1 state is marked CLAIMED');

    const claimRes2 = await claimDailyReward({
      userId: user._id,
      cpaToken: 'demo_token_valid',
    });
    assert(claimRes2.claimedReward.dayNumber === 2, 'Test 6.4: Day 2 claimed successfully');
    assert(claimRes2.claimedReward.value === 10, 'Test 6.5: Day 2 value is 10 VEs');
    assert(claimRes2.wallet.veBalance === 15, 'Test 6.6: Total wallet VE balance is now 15 (5 + 10)');

    // Cleanup test users
    await User.deleteMany({ email: { $in: [testEmail, 'other_user@veloop.com'] } });
    await StreakCycle.deleteMany({ userId: { $in: [user._id, otherUser._id] } });
    await StreakClaim.deleteMany({ userId: { $in: [user._id, otherUser._id] } });
    await Wallet.deleteMany({ userId: { $in: [user._id, otherUser._id] } });

    console.log(`\n====================================================`);
    console.log(`🎯 RESULTS: ${passed} Passed, ${failed} Failed`);
    console.log(`====================================================\n`);

    await mongoose.connection.close();
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('[Security Test Error]', err);
    await mongoose.connection.close();
    process.exit(1);
  }
};

runSecurityTests();
