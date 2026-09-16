const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getDemoUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/demo-users', getDemoUsers);

module.exports = router;
