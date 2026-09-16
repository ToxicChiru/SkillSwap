const Review = require('../models/Review');
const Session = require('../models/Session');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create review for completed session
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { sessionId, knowledge, communication, punctuality, comment } = req.body;

    if (!sessionId || !knowledge || !communication || !punctuality || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Session, rating scores (knowledge, communication, punctuality) and comment are required.' 
      });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    if (session.status !== 'Completed') {
      return res.status(400).json({ success: false, message: 'Can only review completed sessions.' });
    }

    // Determine who is being reviewed (usually learner reviews teacher, or teacher reviews learner)
    const isLearner = session.learner.toString() === req.user._id.toString();
    const isTeacher = session.teacher.toString() === req.user._id.toString();

    if (!isLearner && !isTeacher) {
      return res.status(403).json({ success: false, message: 'You were not a participant in this session.' });
    }

    const reviewedUserId = isLearner ? session.teacher : session.learner;

    // Check if review already exists from this user for this session
    const existingReview = await Review.findOne({
      session: session._id,
      reviewer: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this session.' });
    }

    const overallRating = Math.round(((Number(knowledge) + Number(communication) + Number(punctuality)) / 3) * 10) / 10;

    const review = await Review.create({
      session: session._id,
      reviewer: req.user._id,
      reviewedUser: reviewedUserId,
      skill: session.skill,
      ratings: {
        knowledge: Number(knowledge),
        communication: Number(communication),
        punctuality: Number(punctuality)
      },
      overallRating,
      comment
    });

    session.hasReview = true;
    await session.save();

    // Recalculate reviewed student's overall rating
    const allReviews = await Review.find({ reviewedUser: reviewedUserId });
    const total = allReviews.length;
    const avgOverall = allReviews.reduce((sum, r) => sum + r.overallRating, 0) / total;
    const avgKnowledge = allReviews.reduce((sum, r) => sum + r.ratings.knowledge, 0) / total;
    const avgComm = allReviews.reduce((sum, r) => sum + r.ratings.communication, 0) / total;
    const avgPunct = allReviews.reduce((sum, r) => sum + r.ratings.punctuality, 0) / total;

    const reviewedUser = await User.findById(reviewedUserId);
    reviewedUser.rating = Math.round(avgOverall * 10) / 10;
    reviewedUser.totalReviews = total;
    reviewedUser.ratingBreakdown = {
      knowledge: Math.round(avgKnowledge * 10) / 10,
      communication: Math.round(avgComm * 10) / 10,
      punctuality: Math.round(avgPunct * 10) / 10
    };

    // Check for high rating badge
    if (reviewedUser.rating >= 4.8 && total >= 3 && !reviewedUser.badges.some(b => b.id === 'top-contributor')) {
      reviewedUser.badges.push({
        id: 'top-contributor',
        name: 'Top Contributor',
        icon: '⭐',
        description: 'Maintained 4.8+ rating across multiple peer reviews',
        awardedAt: new Date()
      });
    }

    await reviewedUser.save();

    // Send notification
    await Notification.create({
      recipient: reviewedUserId,
      sender: req.user._id,
      type: 'REVIEW_RECEIVED',
      title: 'New Review Received! ⭐',
      message: `${req.user.name} rated you ${overallRating}/5 stars for your ${session.skill} session!`,
      link: '/profile'
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews for a specific user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedUser: req.params.userId })
      .populate('reviewer', 'name profileImage college branch')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReview,
  getUserReviews
};
