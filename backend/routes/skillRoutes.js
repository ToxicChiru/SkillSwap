const express = require('express');
const router = express.Router();
const { getAllSkills, getCategories, createSkill } = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllSkills);
router.get('/categories', getCategories);
router.post('/', protect, createSkill);

module.exports = router;
