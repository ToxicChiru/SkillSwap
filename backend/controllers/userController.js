const User = require('../models/User');
const Review = require('../models/Review');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const reviews = await Review.find({ reviewedUser: user._id })
      .populate('reviewer', 'name profileImage college branch')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      user,
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update logged in user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { name, college, branch, semester, bio, profileImage } = req.body;
    if (name) user.name = name;
    if (college) user.college = college;
    if (branch) user.branch = branch;
    if (semester !== undefined) user.semester = semester;
    if (bio) user.bio = bio;
    if (profileImage !== undefined) user.profileImage = profileImage;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update teaching and learning skills
// @route   PUT /api/users/skills
// @access  Private
const updateSkills = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { teachingSkills, learningSkills } = req.body;
    if (teachingSkills) user.teachingSkills = teachingSkills;
    if (learningSkills) user.learningSkills = learningSkills;

    // Check if badges should be awarded
    if (user.teachingSkills.length >= 3 && !user.badges.some(b => b.id === 'skill-mentor')) {
      user.badges.push({
        id: 'skill-mentor',
        name: 'Skill Mentor',
        icon: '🎓',
        description: 'Offered 3 or more skills to teach peers',
        awardedAt: new Date()
      });
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Skills updated successfully!',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update availability schedule
// @route   PUT /api/users/availability
// @access  Private
const updateAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.availability = req.body.availability || [];
    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Availability schedule saved!',
      availability: updatedUser.availability
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get campus leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const { category = 'sessions' } = req.query;
    let sortField = { completedSessions: -1, rating: -1 };

    if (category === 'coins') {
      sortField = { skillCoins: -1 };
    } else if (category === 'teachingHours') {
      sortField = { teachingHours: -1 };
    } else if (category === 'rating') {
      sortField = { rating: -1, totalReviews: -1 };
    }

    const leaders = await User.find({ isBanned: false, role: 'student' })
      .select('name college branch semester profileImage rating totalReviews skillCoins completedSessions teachingHours badges')
      .sort(sortField)
      .limit(20);

    res.json({
      success: true,
      leaders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all students (directory/discover)
// @route   GET /api/users
// @access  Public
const getAllUsers = async (req, res) => {
  try {
    const { search, skill, college } = req.query;
    const query = { isBanned: false, role: 'student' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
        { branch: { $regex: search, $options: 'i' } },
        { 'teachingSkills.name': { $regex: search, $options: 'i' } },
        { 'learningSkills.name': { $regex: search, $options: 'i' } }
      ];
    }

    if (skill) {
      query['teachingSkills.name'] = { $regex: skill, $options: 'i' };
    }

    if (college) {
      query.college = { $regex: college, $options: 'i' };
    }

    const users = await User.find(query)
      .select('name email college branch semester profileImage bio teachingSkills learningSkills rating totalReviews skillCoins badges')
      .sort({ rating: -1, completedSessions: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserById,
  updateProfile,
  updateSkills,
  updateAvailability,
  getLeaderboard,
  getAllUsers
};
