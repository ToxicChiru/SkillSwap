const express = require('express');
const router = express.Router();
const { getWallet, transferCoins } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getWallet);
router.post('/transfer', transferCoins);

module.exports = router;
