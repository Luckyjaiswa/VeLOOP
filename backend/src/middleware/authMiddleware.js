const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'veloop_super_secret_jwt_key_2026_secure_streak_token'
      );

      // Never trust frontend-supplied userId; fetch verified user by decoded JWT id
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User session has expired or user no longer exists. Please sign in again.',
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Your account is deactivated. Please contact VELoop support.',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token. Please sign in again.',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication token is required.',
    });
  }
};

module.exports = { protect };
