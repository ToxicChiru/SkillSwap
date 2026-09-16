const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsersAdmin,
  toggleBanUser,
  toggleVerifyUser,
  getReports
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsersAdmin);
router.put('/users/:id/ban', toggleBanUser);
router.put('/users/:id/verify', toggleVerifyUser);
router.get('/reports', getReports);

module.exports = router;
