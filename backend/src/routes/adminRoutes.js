const express = require('express');
const router = express.Router();
const {
  getOverview,
  getUsers,
  getRewards,
  updateReward,
  getClaims,
  getAuditLogs,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes strictly require authentication AND role === 'admin'
router.use(protect);
router.use(adminOnly);

router.get('/overview', getOverview);
router.get('/users', getUsers);
router.get('/rewards', getRewards);
router.put('/rewards/:id', updateReward);
router.get('/claims', getClaims);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
