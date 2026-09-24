const StreakReward = require('../models/StreakReward');
const StreakConfig = require('../models/StreakConfig');
const User = require('../models/User');
const Wallet = require('../models/Wallet');

const DEFAULT_REWARDS = [
  {
    dayNumber: 1,
    rewardType: 'VE',
    value: 5,
    currency: 'VE',
    title: '+5 VEs',
    description: 'Kickstart your streak with free virtual currency credit',
    icon: 'coins',
    isUltimateReward: false,
    badgeText: 'Day 1 Starter',
    color: '#8B5CF6',
  },
  {
    dayNumber: 2,
    rewardType: 'VE',
    value: 10,
    currency: 'VE',
    title: '+10 VEs',
    description: 'Keep the momentum going with double virtual credits',
    icon: 'flame',
    isUltimateReward: false,
    badgeText: 'Day 2 Streak',
    color: '#A855F7',
  },
  {
    dayNumber: 3,
    rewardType: 'VE',
    value: 15,
    currency: 'VE',
    title: '+15 VEs',
    description: 'Midway milestone bonus for loyal daily active check-in',
    icon: 'zap',
    isUltimateReward: false,
    badgeText: 'Day 3 Level Up',
    color: '#EC4899',
  },
  {
    dayNumber: 4,
    rewardType: 'AMAZON_GIFT_CARD',
    value: 1,
    currency: 'INR',
    title: '₹1 Amazon Gift Card',
    description: 'Real cash voucher directly deposited to your digital wallet',
    icon: 'gift',
    isUltimateReward: false,
    badgeText: 'Voucher Special',
    color: '#F59E0B',
  },
  {
    dayNumber: 5,
    rewardType: 'AMAZON_GIFT_CARD',
    value: 2,
    currency: 'INR',
    title: '₹2 Amazon Gift Card',
    description: 'Upgraded cash gift voucher for consecutive dedication',
    icon: 'shopping-bag',
    isUltimateReward: false,
    badgeText: 'Cash Bonus',
    color: '#EAB308',
  },
  {
    dayNumber: 6,
    rewardType: 'VE',
    value: 30,
    currency: 'VE',
    title: '+30 VEs',
    description: 'Massive mega booster prior to the ultimate grand finale',
    icon: 'award',
    isUltimateReward: false,
    badgeText: 'Mega Booster',
    color: '#06B6D4',
  },
  {
    dayNumber: 7,
    rewardType: 'AMAZON_GIFT_CARD',
    value: 5,
    currency: 'INR',
    title: '₹5 Amazon Gift Card',
    description: 'The Ultimate Grand Reward! Complete cycle prize + trophy',
    icon: 'crown',
    isUltimateReward: true,
    badgeText: '🏆 ULTIMATE REWARD',
    color: '#FBBF24',
  },
];

/**
 * Auto seed rewards if table is empty
 */
const autoSeedRewardsIfEmpty = async () => {
  try {
    const count = await StreakReward.countDocuments();
    if (count === 0) {
      console.log('[Seed] Seeding default 7-day streak rewards into MongoDB...');
      await StreakReward.insertMany(DEFAULT_REWARDS);
      console.log('[Seed] 7 Streak Rewards seeded successfully.');
    }

    const configCount = await StreakConfig.countDocuments();
    if (configCount === 0) {
      await StreakConfig.create({
        name: 'default_7_day_cycle',
        cycleLength: 7,
        cooldownHours: 24,
        missedWindowHours: 48,
        cpaRequired: true,
        isActive: true,
      });
      console.log('[Seed] Default StreakConfig created.');
    }
  } catch (error) {
    if (error.code !== 11000) {
      console.error('[Seed Error]', error.message);
    }
  }
};

/**
 * Full seed function for CLI script
 */
const seedDatabase = async () => {
  console.log('[Seed] Clearing existing rewards and configs...');
  await StreakReward.deleteMany({});
  await StreakConfig.deleteMany({});

  console.log('[Seed] Inserting 7 default streak rewards...');
  await StreakReward.insertMany(DEFAULT_REWARDS);

  await StreakConfig.create({
    name: 'default_7_day_cycle',
    cycleLength: 7,
    cooldownHours: 24,
    missedWindowHours: 48,
    cpaRequired: true,
    isActive: true,
  });

  // Create or update demo user
  const demoEmail = 'demo@veloop.com';
  let demoUser = await User.findOne({ email: demoEmail });
  if (!demoUser) {
    console.log('[Seed] Creating demo user (demo@veloop.com / Password123!)...');
    demoUser = await User.create({
      name: 'Alex Rivera',
      email: demoEmail,
      password: 'Password123!',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'user',
    });

    await Wallet.create({
      userId: demoUser._id,
      veBalance: 50,
      totalVeEarned: 50,
      amazonGiftCards: [],
      totalAmazonEarned: 0,
    });
    console.log('[Seed] Demo user created with 50 starter VEs.');
  } else {
    console.log('[Seed] Demo user already exists.');
  }

  console.log('[Seed] Database seed completed successfully!');
};

module.exports = {
  DEFAULT_REWARDS,
  autoSeedRewardsIfEmpty,
  seedDatabase,
};
