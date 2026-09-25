const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getLeaderboard } = require('../controllers/leaderboardController');

/**
 * Middleware: Optional Authentication
 * If a valid Bearer token is provided, populates req.user.
 * If no token or invalid token, continues anonymously without failing.
 */
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'veloop_super_secret_jwt_key_2026_secure_streak_token'
      );
      const user = await User.findById(decoded.id).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (err) {
      // Continue without user
    }
  }
  next();
};

// GET /api/leaderboard
router.get('/', optionalProtect, getLeaderboard);

module.exports = router;
