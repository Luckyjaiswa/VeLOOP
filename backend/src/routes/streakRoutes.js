const express = require('express');
const router = express.Router();
const {
  getDailyStreak,
  getStreakStatus,
  claimReward,
  getStreakHistory,
  handleDevAdvanceDay,
  handleDevSimulateMissed,
  handleBuyFreeze,
} = require('../controllers/streakController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { claimLimiter } = require('../middleware/rateLimiter');

// All streak routes require authentication
router.use(protect);

router.get('/', getDailyStreak);
router.get('/status', getStreakStatus);
router.post('/claim', claimLimiter, claimReward);
router.get('/history', getStreakHistory);
router.post('/buy-freeze', handleBuyFreeze);

// Dev testing helper routes - restricted strictly to Admins (403 Forbidden for normal users)
router.post('/dev-advance-day', adminOnly, handleDevAdvanceDay);
router.post('/dev-simulate-missed', adminOnly, handleDevSimulateMissed);
router.post('/advance-day', adminOnly, handleDevAdvanceDay);
router.post('/simulate', adminOnly, handleDevSimulateMissed);

module.exports = router;
