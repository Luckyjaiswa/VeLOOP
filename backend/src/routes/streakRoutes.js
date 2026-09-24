const express = require('express');
const router = express.Router();
const {
  getDailyStreak,
  getStreakStatus,
  claimReward,
  getStreakHistory,
  handleDevAdvanceDay,
  handleDevSimulateMissed,
} = require('../controllers/streakController');
const { protect } = require('../middleware/authMiddleware');
const { claimLimiter } = require('../middleware/rateLimiter');

// All streak routes require authentication
router.use(protect);

router.get('/', getDailyStreak);
router.get('/status', getStreakStatus);
router.post('/claim', claimLimiter, claimReward);
router.get('/history', getStreakHistory);

// Dev testing helper routes
router.post('/dev-advance-day', handleDevAdvanceDay);
router.post('/dev-simulate-missed', handleDevSimulateMissed);

module.exports = router;
