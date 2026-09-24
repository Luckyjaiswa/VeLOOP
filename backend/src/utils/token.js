const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'veloop_super_secret_jwt_key_2026_secure_streak_token', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = { generateToken };
