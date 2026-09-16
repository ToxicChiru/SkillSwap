const express = require('express');
const router = express.Router();
const {
  getUserById,
  updateProfile,
  updateSkills,
  updateAvailability,
  getLeaderboard,
  getAllUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/leaderboard', getLeaderboard);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/profile', protect, updateProfile);
router.put('/skills', protect, updateSkills);
router.put('/availability', protect, updateAvailability);

module.exports = router;
