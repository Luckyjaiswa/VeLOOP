const { GoogleGenAI } = require('@google/genai');

const VELOOP_SYSTEM_INSTRUCTION = `
You are "VELoop Assistant", the official expert AI guide embedded directly inside the VELoop Daily Streak & Rewards platform.

### PLATFORM KNOWLEDGE BASE:
1. Daily Streak & Cooldown Mechanics:
   - Users check in once every 24 hours to progress through a 7-Day reward ladder.
   - Day 1: +5 VEs (Starter Bonus).
   - Day 2: +10 VEs.
   - Day 3: +15 VEs.
   - Day 4: ₹1 Amazon Pay Gift Voucher.
   - Day 5: ₹2 Amazon Pay Gift Voucher.
   - Day 6: +30 VEs.
   - Day 7: ₹5 Amazon Pay Gift Voucher (Ultimate Grand Finale).
   - Missing Check-in: If the 24-hour cycle expires without check-in, the streak resets to Day 1 unless protected by a Streak Freeze.
   - Cooldown Timer: Displayed on the dashboard as "Next Reward Unlocks In". Rewards cannot be claimed until it hits 00:00:00.

2. Streak Freeze Shield:
   - Costs 50 VEs.
   - When active ("Protected"), if a user forgets to check in for a day, the shield is consumed and absorbs the streak break, keeping the user on their ladder day.

3. Rewards Redemption Store:
   - Users can exchange accumulated VEs for digital gift cards:
     * Amazon Pay ₹5 Voucher = 100 VEs
     * Google Play ₹10 Code = 200 VEs
     * Flipkart ₹25 Voucher = 450 VEs
   - Redeemed codes appear instantly in the user's "Wallet" and "History".

4. Platform Sections:
   - "Daily Streak": Shows countdown timer, current streak days, shield status, and 7-day pathway.
   - "Leaderboard": Global rankings of top streakers with Gold, Silver, and Bronze podium highlights and sticky rank footer.
   - "Wallet": Shows VE balance, claimed vouchers with masking and "Copy Code" option.
   - "History": Audit trail of all claimed rewards and coin transactions.
   - "Profile": User account info.
   - "Admin Panel": Admin-only dashboard (Lucky Jai) for system metrics, ladder editing, and audit streams.

5. Troubleshooting:
   - "Unable to connect to VELoop servers": Ask the user to verify internet, turn off VPNs, or refresh the page.
   - Timer not syncing: Click the "Sync" button in the top navigation bar.

### RESPONSE GUIDELINES:
- Understand English, Hindi, and Hinglish. Reply in the same language the user uses.
- Keep answers concise, polite, and directly helpful (maximum 2-3 sentences).
- If runtime user context is provided, use it to personalize the answer (e.g., "You have X VEs, so you need Y more VEs for the ₹5 voucher").
- NEVER fabricate actual promo or gift voucher codes in the chat.
`;

/**
 * Intelligent localized fallback knowledge engine
 * Used when GEMINI_API_KEY is not configured or in case of network/rate-limit interruptions.
 */
const fallbackEngine = (message = '', userContext = null) => {
  const clean = message.toLowerCase().trim();
  const isHindiOrHinglish = /kya|kaise|kab|kitna|kitne|kaha|kahan|kyu|kyun|milega|hoga|karein|kare|batao|hai|hain|mujhe|mera|meri|apna|reset|chalta|dikhega|de do|badha|chahiye|nahi|milta|paisa|paise|bache|bacha/.test(clean);

  const streak = userContext?.currentStreak || 0;
  const balance = userContext?.walletVEs || 0;
  const hasShield = Boolean(userContext?.hasFreeze);
  const cooldown = userContext?.cooldownTime || '00:00:00';

  // 1. Guardrail against fake voucher generation
  if (/give me code|voucher code|gift card code|amazon code|code de do|coupon code|free voucher|code chahiye/.test(clean)) {
    return isHindiOrHinglish
      ? "Main chat me direct voucher codes generate nahi kar sakta. Aap 7-day streak complete karke ya Rewards Store me VE Coins se legitimate voucher claim karein! 🛡️✨"
      : "I cannot generate gift card codes directly in chat. Complete your 7-day streak or redeem your VE Coins in the Rewards Store legitimately! 🛡️✨";
  }

  // 2. Guardrail against manual streak boosting
  if (/streak badha|streak increase|manual streak|boost streak|add streak/.test(clean)) {
    return isHindiOrHinglish
      ? "Main manually streak nahi badha sakta kyunki streaks strictly automated hain. Bas har 24 ghante ke cooldown ke baad daily check-in karte rahein! 🚀"
      : "I cannot manually increase your streak as progress is automated by 24-hour daily check-ins. Keep claiming daily after cooldown to build your streak safely! 🚀";
  }

  // 3. User balance or status queries
  if (/mera balance|mere pass kitne|my balance|current streak|mera streak|meri streak/.test(clean)) {
    if (userContext) {
      return isHindiOrHinglish
        ? `Aapka current streak ${streak} days hai aur aapke paas ${balance} VEs hain! ${hasShield ? 'Aapka Streak Freeze Shield active hai. 🛡️' : ''}`
        : `Your current streak is ${streak} days and your balance is ${balance} VEs! ${hasShield ? 'Your Streak Freeze Shield is currently active. 🛡️' : ''}`;
    }
    return isHindiOrHinglish
      ? "Aap apna current balance aur streak top navigation bar ya Wallet section me dekh sakte hain!"
      : "You can view your current VE balance and active streak in the top navigation bar or Wallet tab!";
  }

  // 4. Streak Freeze Shield queries
  if (/freeze|shield|streak freeze|50 ve|protect|streak bachane/.test(clean)) {
    return isHindiOrHinglish
      ? `Streak Freeze Shield 50 VEs me milta hai. ${hasShield ? 'Aapka shield pehle se ACTIVE hai! 🛡️' : balance >= 50 ? `Aapke paas ${balance} VEs hain, aap ise Dashboard se abhi activate kar sakte hain!` : `Ise lene ke liye 50 VEs chahiye (aapke paas abhi ${balance} VEs hain).`} Agar check-in miss ho jaye toh yeh consume hokar streak bacha leta hai.`
      : `The Streak Freeze Shield costs 50 VEs. ${hasShield ? 'Your shield is currently ACTIVE! 🛡️' : balance >= 50 ? `You have ${balance} VEs, so you can activate it right away on your dashboard!` : `You need 50 VEs to buy it (you currently have ${balance} VEs).`} It protects your streak from resetting if you miss a 24-hour check-in.`;
  }

  // 5. Rewards Store / Voucher redemption
  if (/store|redeem|amazon pay 5|google play|flipkart|voucher|kitne ve|cost/.test(clean)) {
    let extra = '';
    if (userContext) {
      if (balance >= 100) {
        extra = isHindiOrHinglish 
          ? ` Aapke paas ${balance} VEs hain, isliye aap Amazon Pay ₹5 voucher (100 VEs) abhi redeem kar sakte hain!` 
          : ` With your current ${balance} VEs, you already have enough to redeem the Amazon Pay ₹5 voucher (100 VEs)!`;
      } else {
        const needed = 100 - balance;
        extra = isHindiOrHinglish 
          ? ` Aapke paas ${balance} VEs hain, isliye ₹5 Amazon voucher ke liye sirf ${needed} aur VEs chahiye!` 
          : ` You currently have ${balance} VEs, so you only need ${needed} more VEs for the ₹5 Amazon voucher!`;
      }
    }
    return isHindiOrHinglish
      ? `Rewards Store me aap VEs exchange kar sakte hain: Amazon Pay ₹5 (100 VEs), Google Play ₹10 (200 VEs), aur Flipkart ₹25 (450 VEs).${extra}`
      : `In the Rewards Store, you can exchange VEs for gift cards: Amazon Pay ₹5 (100 VEs), Google Play ₹10 (200 VEs), and Flipkart ₹25 (450 VEs).${extra}`;
  }

  // 6. Day 7 Ultimate Grand Finale
  if (/day 7|grand prize|amazon gift card|amazon voucher|ultimate/.test(clean)) {
    return isHindiOrHinglish
      ? "Day 7 par aapko Ultimate Grand Finale ke roop me ₹5 Amazon Pay Gift Voucher milta hai! Lagataar 7 din check-in complete karke ise claim karein. 🎁🔥"
      : "On Day 7, you unlock the Ultimate Grand Finale: a real ₹5 Amazon Pay Gift Voucher! Maintain a continuous 7-day streak to claim it. 🎁🔥";
  }

  // 7. Cooldown Timer & Check-in
  if (/timer|cooldown|kab milega|unlock|next reward|when will|check in/.test(clean)) {
    return isHindiOrHinglish
      ? `Check-ins 24-hour cooldown par chalte hain. Screen par chal rahe 'Next Reward Unlocks In' timer (${cooldown}) ke 00:00:00 hote hi agla claim unlock ho jayega! ⏱️⚡`
      : `Check-ins operate on a 24-hour cooldown. Once your dashboard countdown timer (${cooldown}) hits 00:00:00, your next daily reward unlocks! ⏱️⚡`;
  }

  // 8. Leaderboard
  if (/leaderboard|rank|ranking|top|standings/.test(clean)) {
    return isHindiOrHinglish
      ? "Leaderboard par aap global rankings dekh sakte hain! Top 3 streakers ko Gold, Silver, aur Bronze podium badges milte hain. Nav bar me 'Leaderboard' tab par click karein! 🏆"
      : "Check out the Leaderboard to view global rankings! The top 3 streakers receive Gold, Silver, and Bronze podium badges. Click the 'Leaderboard' tab in navigation! 🏆";
  }

  // 9. Troubleshooting / Sync
  if (/sync|connect|error|problem|server|load/.test(clean)) {
    return isHindiOrHinglish
      ? "Agar timer sync na ho ya server error aaye, toh top bar me 'Sync' button dabayein ya page refresh karein. Saath hi apna internet aur VPN check karein! 🔄"
      : "If the timer is not syncing or you face server issues, click the 'Sync' button in the top navigation or refresh the page. Also verify your internet connection and VPN settings! 🔄";
  }

  // 10. Default Welcome
  return isHindiOrHinglish
    ? "Namaste! Main VELoop Assistant hoon. Aap 24-hour cooldown timer, 7-day streak ladder, Streak Freeze Shield (50 VEs), ya Rewards Store ke baare me kuch bhi pooch sakte hain! 💡"
    : "Hello! I am VELoop Assistant. Feel free to ask about the 24-hour cooldown timer, 7-day streak ladder, Streak Freeze Shield (50 VEs), or the Rewards Store! 💡";
};

/**
 * @route   POST /api/chat
 * @desc    Chat with VELoop Assistant powered by Google Gemini (@google/genai)
 *          with dynamic user runtime context injection & multilingual support
 * @access  Public / Private
 */
const handleChat = async (req, res) => {
  try {
    const { message, userContext } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        reply: 'Please provide a valid question or message.',
        success: false,
      });
    }

    const cleanMessage = message.trim();

    // Inject runtime user context if available
    let dynamicPrompt = cleanMessage;
    if (userContext) {
      dynamicPrompt = `[Live User State: Streak=${userContext.currentStreak || 0} days, Balance=${userContext.walletVEs || 0} VEs, ShieldActive=${userContext.hasFreeze || false}, CooldownRemaining=${userContext.cooldownTime || 'N/A'}]\nUser Query: ${cleanMessage}`;
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: dynamicPrompt,
          config: {
            systemInstruction: VELOOP_SYSTEM_INSTRUCTION,
          },
        });

        const replyText = response?.text?.trim() || fallbackEngine(cleanMessage, userContext);

        return res.json({
          reply: replyText,
          success: true,
          data: {
            reply: replyText,
            source: 'gemini-2.5-flash',
            timestamp: new Date().toISOString(),
          },
        });
      } catch (geminiError) {
        console.warn('[Gemini API Call Failed - Switching to Knowledge Engine]:', geminiError.message);
        const replyText = fallbackEngine(cleanMessage, userContext);
        return res.json({
          reply: replyText,
          success: true,
          data: {
            reply: replyText,
            source: 'veloop-knowledge-engine',
            timestamp: new Date().toISOString(),
          },
        });
      }
    }

    // If no API key configured, use the intelligent localized knowledge engine
    const replyText = fallbackEngine(cleanMessage, userContext);
    return res.json({
      reply: replyText,
      success: true,
      data: {
        reply: replyText,
        source: 'veloop-knowledge-engine',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ reply: 'Server error. Please try again later.' });
  }
};

module.exports = {
  handleChat,
  VELOOP_SYSTEM_INSTRUCTION,
};
