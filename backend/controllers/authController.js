const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'skillswap_super_secret_jwt_key_college_2026_exchange', {
    expiresIn: '30d'
  });
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, college, branch, semester, bio, teachingSkills, learningSkills } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      college: college || 'National Institute of Technology',
      branch: branch || 'Computer Science & Engineering',
      semester: semester || 5,
      bio: bio || 'Passionate student eager to exchange skills!',
      teachingSkills: teachingSkills || [],
      learningSkills: learningSkills || [],
      skillCoins: 50, // Welcome bonus
      badges: [{
        id: 'welcome',
        name: 'New Explorer',
        icon: '🌱',
        description: 'Joined the SkillSwap campus learning network',
        awardedAt: new Date()
      }]
    });

    // Create welcome transaction
    await Transaction.create({
      user: user._id,
      type: 'Bonus',
      amount: 50,
      reason: 'Welcome bonus for joining SkillSwap!',
      balanceAfter: 50
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        semester: user.semester,
        role: user.role,
        skillCoins: user.skillCoins,
        rating: user.rating,
        badges: user.badges,
        teachingSkills: user.teachingSkills,
        learningSkills: user.learningSkills
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, message: 'Your account is suspended. Contact campus admin.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        semester: user.semester,
        bio: user.bio,
        role: user.role,
        skillCoins: user.skillCoins,
        rating: user.rating,
        badges: user.badges,
        teachingSkills: user.teachingSkills,
        learningSkills: user.learningSkills,
        completedSessions: user.completedSessions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get demo personas for 1-click login
// @route   GET /api/auth/demo-users
// @access  Public
const getDemoUsers = async (req, res) => {
  try {
    const demoUsers = await User.find({
      email: { $in: [
        'aditya.python@college.edu',
        'ananya.design@college.edu',
        'rahul.ai@college.edu',
        'admin@skillswap.edu'
      ]}
    }).select('name email role college branch teachingSkills learningSkills rating skillCoins profileImage bio');

    res.json({
      success: true,
      demoUsers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getDemoUsers
};
