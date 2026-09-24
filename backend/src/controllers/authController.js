const User = require('../models/User');
const { generateToken } = require('../utils/token');
const { getOrCreateWallet } = require('../services/walletService');
const { getStreakDashboardData } = require('../services/streakService');
const { logAudit } = require('../services/auditService');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your full name, email, and a secure password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please login instead.',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    });

    // Initialize wallet
    const wallet = await getOrCreateWallet(user._id);

    // Initialize streak cycle
    await getStreakDashboardData(user._id);

    // Log audit
    await logAudit({
      userId: user._id,
      action: 'USER_REGISTER',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'SUCCESS',
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to VELoop Rewards.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
      },
      wallet: {
        veBalance: wallet.veBalance,
        totalAmazonEarned: wallet.totalAmazonEarned,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get JWT token
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both your email address and password.',
      });
    }

    // Check for user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      await logAudit({
        action: 'FAILED_LOGIN_ATTEMPT',
        metadata: { email },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        status: 'WARNING',
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      await logAudit({
        userId: user._id,
        action: 'FAILED_LOGIN_PASSWORD',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        status: 'WARNING',
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is deactivated. Please contact VELoop support.',
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const wallet = await getOrCreateWallet(user._id);
    const token = generateToken(user._id);

    await logAudit({
      userId: user._id,
      action: 'USER_LOGIN',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'SUCCESS',
    });

    return res.status(200).json({
      success: true,
      message: 'Signed in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        lastLoginAt: user.lastLoginAt,
      },
      wallet: {
        veBalance: wallet.veBalance,
        totalAmazonEarned: wallet.totalAmazonEarned,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user details
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    const wallet = await getOrCreateWallet(user._id);

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      },
      wallet: {
        veBalance: wallet.veBalance,
        totalVeEarned: wallet.totalVeEarned,
        totalAmazonEarned: wallet.totalAmazonEarned,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Log out user
 * @access  Private
 */
const logout = async (req, res) => {
  await logAudit({
    userId: req.user._id,
    action: 'USER_LOGOUT',
    ipAddress: req.ip,
    status: 'SUCCESS',
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  logout,
};
