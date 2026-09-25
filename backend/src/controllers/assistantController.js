const StreakCycle = require('../models/StreakCycle');
const Wallet = require('../models/Wallet');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Detect language style: Hinglish/Hindi or English
 */
const detectLanguage = (text = '') => {
  const lower = text.toLowerCase();
  const hindiHinglishKeywords = [
    'kab', 'kya', 'kaise', 'kaha', 'kahan', 'kyu', 'kyun', 'milega', 'hoga',
    'karein', 'kare', 'batao', 'bataiye', 'hai', 'hain', 'mujhe', 'mera',
    'meri', 'apna', 'reset', 'kitna', 'kitne', 'chalta', 'dikhega', 'gaya',
    'gayi', 'de do', 'badha', 'chahiye', 'nahi', 'khatam', 'milta', 'namaste',
    'shukriya', 'theek', 'paisa', 'paise', 'karo', 'karu'
  ];

  const matched = hindiHinglishKeywords.some((word) =>
    new RegExp(`\\b${word}\\b`, 'i').test(lower)
  );

  return matched ? 'hinglish' : 'english';
};

/**
 * Intelligent VELoop Assistant Rule-Engine
 * Adheres strictly to:
 * - Short & crisp answers (max 2-3 sentences)
 * - Friendly, motivating, precise, polite tone
 * - Live Platform Rules & Data
 * - Strict Chat Guardrails (No fake vouchers, no manual streak promises)
 */
const generateAssistantReply = (userMessage = '', userContext = {}) => {
  const clean = userMessage.toLowerCase().trim();
  const lang = detectLanguage(clean);
  const isHinglish = lang === 'hinglish';

  // 1. GUARDRAIL: Direct voucher / gift card code generation request
  const voucherCodePatterns = [
    'give me code', 'voucher code', 'gift card code', 'amazon code',
    'code de do', 'fake code', 'free code', 'coupon code', 'generate code',
    'amazon voucher code', 'gift voucher', 'mujhe code', 'free voucher'
  ];
  if (voucherCodePatterns.some((p) => clean.includes(p))) {
    if (isHinglish) {
      return {
        reply: "Main chat me direct voucher codes generate nahi kar sakta. Amazon Gift Card paane ke liye lagatar 7 din streak complete karke dashboard par claim karein! 🛡️✨",
        suggested: ["Day 7 Grand Prize kya hai?", "Agla reward kab milega?"]
      };
    }
    return {
      reply: "I cannot generate gift card or voucher codes directly in chat. You can earn an official ₹5 Amazon Gift Card legitimately by completing your 7-day streak on the dashboard! 🛡️✨",
      suggested: ["What is the Day 7 Grand Prize?", "When unlocks next reward?"]
    };
  }

  // 2. GUARDRAIL: Manual streak boost or increase promise
  const streakBoostPatterns = [
    'streak badha', 'streak increase', 'manual streak', 'boost streak',
    'add streak', 'streak add', 'streak change', 'give me streak',
    'streak 7 kar do', 'free streak', 'streak badhao'
  ];
  if (streakBoostPatterns.some((p) => clean.includes(p))) {
    if (isHinglish) {
      return {
        reply: "Main manually streak nahi badha sakta, kyunki streaks strictly automated aur daily verification par chalti hain. Aap har 24 ghante ke cooldown ke baad check-in karke apni streak aage badhayein! 🚀",
        suggested: ["Agla reward kab milega?", "Streak break hui toh?"]
      };
    }
    return {
      reply: "I cannot manually increase or alter your streak, as all progress is securely automated by daily check-ins. Keep claiming after each 24-hour cooldown to build your streak safely! 🚀",
      suggested: ["When unlocks next reward?", "What happens on missed day?"]
    };
  }

  // 3. RULE 1: Daily Check-in & Timer ("Next Reward Unlocks In", 24h Cooldown)
  const timerPatterns = [
    'kab milega', 'next reward', 'timer', 'cooldown', 'unlock', 'claim kab',
    'next claim', 'when will i get', 'countdown', 'time bacha', 'ghante'
  ];
  if (timerPatterns.some((p) => clean.includes(p))) {
    if (isHinglish) {
      return {
        reply: "Daily check-in 24-hour cooldown par chalta hai. Aap screen par chal rahe 'Next Reward Unlocks In' countdown timer ko check karein, timer khatam hote hi agla claim unlock ho jayega! ⏱️⚡",
        suggested: ["Day 1 aur Day 2 ke rewards?", "Timer sync nahi ho raha?"]
      };
    }
    return {
      reply: "Daily check-ins run on a 24-hour cooldown. Please check the 'Next Reward Unlocks In' countdown timer on your dashboard—your next claim unlocks the moment it reaches zero! ⏱️⚡",
      suggested: ["What are Day 1 & Day 2 rewards?", "Timer out of sync?"]
    };
  }

  // 4. RULE 2: Day 7 Ultimate Grand Prize (₹5 Amazon Gift Card)
  const day7Patterns = [
    'day 7', 'grand prize', 'amazon gift card', 'amazon voucher',
    'ultimate prize', '5 rs', '₹5', '5 rupees', 'amazon card', 'last reward'
  ];
  if (day7Patterns.some((p) => clean.includes(p))) {
    if (isHinglish) {
      return {
        reply: "Day 7 par aapko Ultimate Grand Prize ke roop me ₹5 Amazon Gift Card milta hai! Yeh reward lagatar 7 consecutive days check-in complete karne par claim ke liye unlock hota hai. 🎁🔥",
        suggested: ["Day 1 aur Day 2 ke rewards?", "Streak break hui toh?"]
      };
    }
    return {
      reply: "On Day 7, you unlock the Ultimate Grand Prize: a ₹5 Amazon Gift Card! Simply maintain a continuous 7-day streak to claim this reward. 🎁🔥",
      suggested: ["What are Day 1 & Day 2 rewards?", "What happens if streak breaks?"]
    };
  }

  // 5. RULE 2: Rewards & Streak Ladder (Day 1, Day 2, etc.)
  const rewardLadderPatterns = [
    'day 1', 'day 2', 've coins', 'starter bonus', 'reward ladder',
    'rewards list', 'kitne coins', 'kitna reward', 've bonus', 'coins'
  ];
  if (rewardLadderPatterns.some((p) => clean.includes(p))) {
    if (isHinglish) {
      return {
        reply: "Day 1 par aapko +5 VEs starter bonus milta hai aur Day 2 par +10 VEs reward (24h cooldown ke baad). Aise hi continue karke Day 7 par ₹5 Amazon Gift Card jeetein! 🪙✨",
        suggested: ["Day 7 Grand Prize kya hai?", "Agla reward kab milega?"]
      };
    }
    return {
      reply: "Day 1 awards a +5 VEs starter bonus, and Day 2 gives +10 VEs after the 24-hour cooldown. Continue your daily progress to reach Day 7's ₹5 Amazon Gift Card! 🪙✨",
      suggested: ["What is Day 7 Grand Prize?", "When unlocks next reward?"]
    };
  }

  // 6. RULE 2: Missing Check-in & Streak Reset
  const resetPatterns = [
    'miss', 'missed', 'streak break', 'reset', 'tut gayi', 'toot gayi',
    'chhoot gaya', 'bhool gaya', 'streak lost', 'day 1 par'
  ];
  if (resetPatterns.some((p) => clean.includes(p))) {
    if (isHinglish) {
      return {
        reply: "Continuous daily check-in break hone par streak reset hokar Day 1 par aa jati hai. Isliye har 24 ghante ke baad daily claim karke apni streak hamesha active rakhein! ⚠️🔥",
        suggested: ["Agla reward kab milega?", "Day 7 Grand Prize kya hai?"]
      };
    }
    return {
      reply: "If you miss a daily check-in window, your streak resets back to Day 1. Be sure to check in promptly after your 24-hour cooldown to keep your streak intact! ⚠️🔥",
      suggested: ["When unlocks next reward?", "What is Day 7 Grand Prize?"]
    };
  }

  // 7. RULE 3: Wallet & History Tab
  const walletHistoryPatterns = [
    'wallet', 'balance', 'history', 'kaha dikhte', 'kahan dikhe',
    'check balance', 'passbook', 'transactions', 'purane reward', 'claim history'
  ];
  if (walletHistoryPatterns.some((p) => clean.includes(p))) {
    if (isHinglish) {
      return {
        reply: "Aapke total VE Coins aur Amazon vouchers top navigation bar aur 'Wallet' section me live dikhte hain. Saath hi sabhi claims ki poori detail aapko 'History' tab me mil jayegi! 💼📜",
        suggested: ["Coins kaise use karein?", "Agla reward kab milega?"]
      };
    }
    return {
      reply: "Your total VE Coins and Amazon vouchers are displayed in the top bar and the 'Wallet' section. Full details of every claim can be viewed anytime in the 'History' tab! 💼📜",
      suggested: ["How to check wallet?", "When unlocks next reward?"]
    };
  }

  // 8. RULE 4: Support / Timer or Reward Sync Issue
  const syncPatterns = [
    'sync', 'stuck', 'timer ruk gaya', 'not updating', 'glitch', 'error',
    'refresh', 'sync data', 'problem', 'kaam nahi kar raha', 'issue'
  ];
  if (syncPatterns.some((p) => clean.includes(p))) {
    if (isHinglish) {
      return {
        reply: "Agar countdown timer ya rewards sync na ho rahe hon, toh screen par 'Sync Data' button click karein ya page refresh karein. Isse aapka latest status server se turant update ho jayega! 🔄🛠️",
        suggested: ["Agla reward kab milega?", "History kaise dekhein?"]
      };
    }
    return {
      reply: "If your countdown timer or rewards seem out of sync, simply click the 'Sync Data' button or refresh the page. This instantly syncs your dashboard with the VELoop servers! 🔄🛠️",
      suggested: ["When unlocks next reward?", "How to view history?"]
    };
  }

  // 9. CPA / Claim Task / How to Claim
  const claimHowPatterns = [
    'claim kaise', 'how to claim', 'task', 'cpa', 'ad', 'unlock kaise',
    'claim button', 'click to claim'
  ];
  if (claimHowPatterns.some((p) => clean.includes(p))) {
    if (isHinglish) {
      return {
        reply: "Jab reward card unlock ho jaye, uspe click karein aur prompt hone par quick sponsored engagement task complete karein. Task pura hote hi reward turant aapke wallet me add ho jayega! 🎯✨",
        suggested: ["Agla reward kab milega?", "Day 7 Grand Prize kya hai?"]
      };
    }
    return {
      reply: "When a reward card unlocks, click on it and complete the brief sponsored engagement task. Your reward will be credited directly to your wallet upon verification! 🎯✨",
      suggested: ["When unlocks next reward?", "What is Day 7 Grand Prize?"]
    };
  }

  // 10. Greetings
  const greetingPatterns = [
    'hi', 'hello', 'hey', 'namaste', 'halo', 'sup', 'kya haal', 'good morning',
    'good evening', 'pranam', 'yo'
  ];
  if (greetingPatterns.some((p) => clean === p || clean.startsWith(p + ' '))) {
    const userName = userContext?.name ? ` ${userContext.name}` : '';
    if (isHinglish) {
      return {
        reply: `Namaste${userName}! Main hoon VELoop Assistant. Aapke Daily Streak, countdown timer ya rewards se juda koi bhi sawaal ho, toh poochiye! 👋✨`,
        suggested: ["Agla reward kab milega?", "Day 7 Grand Prize kya hai?", "Timer sync nahi ho raha?"]
      };
    }
    return {
      reply: `Hello${userName}! I am VELoop Assistant. How can I help you with your daily streaks, countdown timer, or rewards today? 👋✨`,
      suggested: ["When unlocks next reward?", "What is Day 7 Grand Prize?", "Timer out of sync?"]
    };
  }

  // 11. Identity / Who are you
  const identityPatterns = ['who are you', 'kaun ho', 'tum kaun', 'aap kaun', 'kya karte ho'];
  if (identityPatterns.some((p) => clean.includes(p))) {
    if (isHinglish) {
      return {
        reply: "Main VELoop Assistant hoon, aapka personal streak aur rewards guide! Main yahan aapko daily check-ins, cooldown timer aur rewards ladder me guide karne ke liye hoon. 🚀",
        suggested: ["Agla reward kab milega?", "Day 7 Grand Prize kya hai?"]
      };
    }
    return {
      reply: "I am VELoop Assistant, your personal guide for VELoop daily streaks, countdown timers, and rewards! Let me know if you need any assistance navigating the platform. 🚀",
      suggested: ["When unlocks next reward?", "What is Day 7 Grand Prize?"]
    };
  }

  // 12. Default Fallback (Motivating, short, guiding back to dashboard)
  if (isHinglish) {
    return {
      reply: "Main VELoop Daily Streaks aur Rewards me aapki madad ke liye tayyar hoon. Aap countdown timer, rewards ladder (Day 1, 2, 7) ya wallet ke baare me pooch sakte hain! 💡",
      suggested: ["Agla reward kab milega?", "Day 7 Grand Prize kya hai?", "Coins kahan dikhte hain?"]
    };
  }
  return {
    reply: "I am here to help you maximize your VELoop Daily Streaks and Rewards. Feel free to ask about the countdown timer, streak ladder (Day 1, 2, 7), or your wallet balance! 💡",
    suggested: ["When unlocks next reward?", "What is Day 7 Grand Prize?", "Where is my wallet?"]
  };
};

/**
 * Controller: Handle Assistant Chat Queries
 * POST /api/assistant/chat
 */
exports.handleAssistantChat = async (req, res) => {
  try {
    const { message = '' } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty.',
      });
    }

    // Optional user context from token if user is signed in
    let userContext = {};
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'veloop_super_secret_jwt_key_2026_secure_streak_token'
        );
        const user = await User.findById(decoded.id).select('name email');
        if (user) {
          const streak = await StreakCycle.findOne({ userId: user._id, status: 'ACTIVE' });
          const wallet = await Wallet.findOne({ userId: user._id });
          userContext = {
            name: user.name,
            currentStreak: streak?.currentStreak || 0,
            nextClaimAt: streak?.nextClaimAt || null,
            veBalance: wallet?.veBalance || 0,
            amazonTotal: wallet?.totalAmazonEarned || 0,
          };
        }
      } catch (e) {
        // Token optional; proceed as guest
      }
    }

    const { reply, suggested } = generateAssistantReply(message, userContext);

    return res.status(200).json({
      success: true,
      data: {
        reply,
        suggested: suggested || [],
        userContext: userContext.name ? {
          name: userContext.name,
          streak: userContext.currentStreak,
        } : null,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Assistant Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Assistant encountered an issue. Please try again.',
    });
  }
};
