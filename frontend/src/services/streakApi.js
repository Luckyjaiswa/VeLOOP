import api from './api';

/**
 * Fetch complete daily streak dashboard data
 * Includes current cycle, eligibility, 7-day cards with states, countdowns, and stats
 */
export const getDailyStreak = async () => {
  const response = await api.get('/api/daily-streak');
  return response.data;
};

/**
 * Lightweight check for live countdown verification & eligibility status
 */
export const getStreakStatus = async () => {
  const response = await api.get('/api/daily-streak/status');
  return response.data;
};

/**
 * Claim the currently available daily streak reward
 * @param {Object} data - { cpaToken, cpaEngagementSeconds }
 */
export const claimDailyReward = async (data = {}) => {
  const response = await api.post('/api/daily-streak/claim', data);
  return response.data;
};

/**
 * Fetch paginated reward claim history
 * @param {number} page
 * @param {number} limit
 */
export const getStreakHistory = async (page = 1, limit = 15) => {
  const response = await api.get(`/api/daily-streak/history?page=${page}&limit=${limit}`);
  return response.data;
};

/**
 * Fetch wallet balance, Amazon vouchers, and transactions
 */
export const getWallet = async () => {
  const response = await api.get('/api/wallet');
  return response.data;
};

/**
 * Mark an Amazon gift card voucher as redeemed
 */
export const redeemGiftCard = async (voucherId) => {
  const response = await api.post(`/api/wallet/redeem/${voucherId}`);
  return response.data;
};

/**
 * Dev Helper: Fast-forward cooldown to test all 7 days seamlessly
 */
export const devAdvanceDay = async () => {
  const response = await api.post('/api/daily-streak/dev-advance-day');
  return response.data;
};

/**
 * Dev Helper: Simulate a missed 48-hour window to test automatic streak reset
 */
export const devSimulateMissed = async () => {
  const response = await api.post('/api/daily-streak/dev-simulate-missed');
  return response.data;
};

// ================= Auth API Calls =================

export const loginUser = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/api/auth/logout');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/api/auth/profile', profileData);
  return response.data;
};

// ================= Admin API Calls =================

export const getAdminOverview = async () => {
  const response = await api.get('/api/admin/overview');
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await api.get('/api/admin/users');
  return response.data;
};

export const getAdminRewards = async () => {
  const response = await api.get('/api/admin/rewards');
  return response.data;
};

export const updateAdminReward = async (id, data) => {
  const response = await api.put(`/api/admin/rewards/${id}`, data);
  return response.data;
};

export const getAdminClaims = async () => {
  const response = await api.get('/api/admin/claims');
  return response.data;
};

export const getAdminAuditLogs = async () => {
  const response = await api.get('/api/admin/audit-logs');
  return response.data;
};

// ================= Streak Freeze & Store API Calls =================

/**
 * Purchase a Streak Freeze Shield for 50 VEs
 */
export const buyStreakFreeze = async () => {
  const response = await api.post('/api/streak/buy-freeze');
  return response.data;
};

/**
 * Fetch Rewards Store vouchers catalog
 */
export const getRedeemCatalog = async () => {
  const response = await api.get('/api/rewards/catalog');
  return response.data;
};

/**
 * Redeem VE Coins for digital gift voucher
 * @param {string} rewardType - 'AMAZON_5' | 'GOOGLE_PLAY_10' | 'FLIPKART_25'
 */
export const redeemStoreVoucher = async (rewardType) => {
  const response = await api.post('/api/rewards/redeem', { rewardType });
  return response.data;
};

/**
 * Send message to AI Chatbot endpoint
 * @param {string} message
 * @param {Object} userContext - Optional dynamic live user state
 */
export const sendChatMessage = async (message, userContext = null) => {
  const response = await api.post('/api/chat', { message, userContext });
  return response.data;
};

/**
 * Fetch Global Leaderboard (Top 10 users + current user rank and stats)
 */
export const getLeaderboard = async () => {
  const response = await api.get('/api/leaderboard');
  return response.data;
};

export default {
  getDailyStreak,
  getStreakStatus,
  claimDailyReward,
  getStreakHistory,
  getWallet,
  redeemGiftCard,
  devAdvanceDay,
  devSimulateMissed,
  buyStreakFreeze,
  getRedeemCatalog,
  redeemStoreVoucher,
  sendChatMessage,
  getLeaderboard,
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
  updateProfile,
  getAdminOverview,
  getAdminUsers,
  getAdminRewards,
  updateAdminReward,
  getAdminClaims,
  getAdminAuditLogs,
};
