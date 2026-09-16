const Skill = require('../models/Skill');

// @desc    Get all skills with filter & search
// @route   GET /api/skills
// @access  Public
const getAllSkills = async (req, res) => {
  try {
    const { category, search, popular } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (popular === 'true') {
      query.popular = true;
    }

    const skills = await Skill.find(query).sort({ popular: -1, teachersCount: -1, name: 1 });

    res.json({
      success: true,
      count: skills.length,
      skills
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get skill categories
// @route   GET /api/skills/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = [
      'All',
      'Programming',
      'Web Development',
      'AI / ML',
      'Database',
      'Design',
      'Academics',
      'Languages',
      'Music',
      'Photography',
      'Video Editing',
      'Communication',
      'Other'
    ];
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private
const createSkill = async (req, res) => {
  try {
    const { name, category, description, icon } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Skill name and category are required.' });
    }

    const existingSkill = await Skill.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingSkill) {
      return res.status(400).json({ success: false, message: 'This skill already exists in the catalog.' });
    }

    const skill = await Skill.create({
      name,
      category,
      description: description || '',
      icon: icon || '✨'
    });

    res.status(201).json({
      success: true,
      message: 'Skill added to platform catalog!',
      skill
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllSkills,
  getCategories,
  createSkill
};
