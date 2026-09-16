const User = require('../models/User');
const Skill = require('../models/Skill');
const Session = require('../models/Session');
const SwapRequest = require('../models/SwapRequest');
const Report = require('../models/Report');

// @desc    Get platform statistics for Admin dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalSkills = await Skill.countDocuments();
    const totalSessions = await Session.countDocuments();
    const completedSessions = await Session.countDocuments({ status: 'Completed' });
    const pendingRequests = await SwapRequest.countDocuments({ status: 'Pending' });
    const totalReports = await Report.countDocuments({ status: 'Pending' });

    // Aggregate total SkillCoins
    const users = await User.find({ role: 'student' }).select('skillCoins');
    const totalCoinsInCirculation = users.reduce((acc, u) => acc + (u.skillCoins || 0), 0);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalSkills,
        totalSessions,
        completedSessions,
        pendingRequests,
        totalReports,
        totalCoinsInCirculation
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users for management
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle student suspension / ban
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot ban an administrator.' });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.name} has been ${user.isBanned ? 'suspended' : 'reinstated'}.`,
      isBanned: user.isBanned
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle student campus verification
// @route   PUT /api/admin/users/:id/verify
// @access  Private/Admin
const toggleVerifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.isVerified = !user.isVerified;
    await user.save();

    res.json({
      success: true,
      message: `User verification status updated to ${user.isVerified}.`,
      isVerified: user.isVerified
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user reports
// @route   GET /api/admin/reports
// @access  Private/Admin
const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'name email college')
      .populate('reportedUser', 'name email college isBanned')
      .sort({ createdAt: -1 });

    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsersAdmin,
  toggleBanUser,
  toggleVerifyUser,
  getReports
};
