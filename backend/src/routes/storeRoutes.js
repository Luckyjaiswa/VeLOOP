const express = require('express');
const router = express.Router();
const { getStoreCatalog, redeemVoucher } = require('../controllers/storeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/catalog', protect, getStoreCatalog);
router.post('/redeem', protect, redeemVoucher);

module.exports = router;
