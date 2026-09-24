const express = require('express');
const router = express.Router();
const { getWallet, redeemGiftCard } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getWallet);
router.post('/redeem/:id', redeemGiftCard);

module.exports = router;
