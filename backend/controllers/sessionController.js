const Session = require('../models/Session');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const SwapRequest = require('../models/SwapRequest');

// @desc    Schedule a new learning session
// @route   POST /api/sessions
// @access  Private
const createSession = async (req, res) => {
  try {
    const { partnerId, role, skill, date, startTime, endTime, meetingLink, notes, swapRequestId } = req.body;

    if (!partnerId || !skill || !date || !startTime) {
      return res.status(400).json({ 
        success: false, 
        message: 'Partner, skill, date, and start time are required.' 
      });
    }

    const teacher = role === 'teacher' ? req.user._id : partnerId;
    const learner = role === 'learner' ? req.user._id : partnerId;

    const partner = await User.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner student not found.' });
    }

    const session = await Session.create({
      teacher,
      learner,
      skill,
      date: new Date(date),
      startTime,
      endTime: endTime || '19:00',
      meetingLink: meetingLink || 'https://meet.google.com/skillswap-study-room',
      notes: notes || '',
      swapRequest: swapRequestId || null
    });

    // Notify partner
    await Notification.create({
      recipient: partnerId,
      sender: req.user._id,
      type: 'SESSION_SCHEDULED',
      title: 'New Session Scheduled! 📅',
      message: `${req.user.name} scheduled a ${skill} session on ${new Date(date).toLocaleDateString()} at ${startTime}.`,
      link: '/sessions'
    });

    res.status(201).json({
      success: true,
      message: 'Session successfully scheduled!',
      session
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's sessions (upcoming & completed)
// @route   GET /api/sessions
// @access  Private
const getMySessions = async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({
      $or: [{ teacher: userId }, { learner: userId }]
    })
      .populate('teacher', 'name profileImage college branch rating')
      .populate('learner', 'name profileImage college branch rating')
      .sort({ date: 1, startTime: 1 });

    res.json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark session as completed and transfer SkillCoins
// @route   PUT /api/sessions/:id/complete
// @access  Private
const completeSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('teacher')
      .populate('learner');

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const isTeacher = session.teacher._id.toString() === req.user._id.toString();
    const isLearner = session.learner._id.toString() === req.user._id.toString();

    if (!isTeacher && !isLearner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only session participants can complete this session.' });
    }

    if (session.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'This session has already been marked completed.' });
    }

    session.status = 'Completed';
    await session.save();

    const coinAmount = 10; // 1 hr = 10 SkillCoins

    // Update Teacher: +10 SkillCoins, +1 teaching hour, +1 completed session
    const teacher = await User.findById(session.teacher._id);
    teacher.skillCoins += coinAmount;
    teacher.teachingHours += session.durationHours || 1;
    teacher.completedSessions += 1;

    // Check & Award Teacher Badges
    if (!teacher.badges.some(b => b.id === 'first-teacher')) {
      teacher.badges.push({
        id: 'first-teacher',
        name: 'First Teacher',
        icon: '🌟',
        description: 'Successfully completed their first teaching session',
        awardedAt: new Date()
      });
    }
    if (teacher.completedSessions >= 5 && !teacher.badges.some(b => b.id === 'knowledge-sharer')) {
      teacher.badges.push({
        id: 'knowledge-sharer',
        name: 'Knowledge Sharer',
        icon: '🔥',
        description: 'Completed 5+ peer teaching sessions',
        awardedAt: new Date()
      });
    }
    if (teacher.completedSessions >= 10 && !teacher.badges.some(b => b.id === 'skill-master')) {
      teacher.badges.push({
        id: 'skill-master',
        name: 'Skill Master',
        icon: '👑',
        description: 'Completed 10+ peer teaching sessions with high satisfaction',
        awardedAt: new Date()
      });
    }

    await teacher.save();

    // Teacher Transaction
    await Transaction.create({
      user: teacher._id,
      type: 'Earned',
      amount: coinAmount,
      reason: `Taught ${session.skill} for 1 hour to ${session.learner.name}`,
      session: session._id,
      balanceAfter: teacher.skillCoins
    });

    // Update Learner: -10 SkillCoins, +1 learning hour, +1 completed session
    const learner = await User.findById(session.learner._id);
    learner.skillCoins = Math.max(0, learner.skillCoins - coinAmount);
    learner.learningHours += session.durationHours || 1;
    learner.completedSessions += 1;
    await learner.save();

    // Learner Transaction
    await Transaction.create({
      user: learner._id,
      type: 'Spent',
      amount: coinAmount,
      reason: `Learned ${session.skill} for 1 hour from ${session.teacher.name}`,
      session: session._id,
      balanceAfter: learner.skillCoins
    });

    // Notifications
    await Notification.create({
      recipient: teacher._id,
      sender: learner._id,
      type: 'COINS_EARNED',
      title: 'SkillCoins Received! 🪙',
      message: `You earned +10 SkillCoins for teaching ${session.skill} to ${learner.name}!`,
      link: '/wallet'
    });

    await Notification.create({
      recipient: learner._id,
      sender: teacher._id,
      type: 'SESSION_COMPLETED',
      title: 'Session Completed! 🎉',
      message: `Your ${session.skill} session with ${teacher.name} is complete. Please leave a review!`,
      link: '/sessions'
    });

    res.json({
      success: true,
      message: 'Session completed! 10 SkillCoins transferred successfully.',
      session
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel session
// @route   PUT /api/sessions/:id/cancel
// @access  Private
const cancelSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    session.status = 'Cancelled';
    await session.save();

    res.json({
      success: true,
      message: 'Session cancelled.',
      session
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSession,
  getMySessions,
  completeSession,
  cancelSession
};
