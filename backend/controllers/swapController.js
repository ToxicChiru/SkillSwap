const SwapRequest = require('../models/SwapRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Create new swap request
// @route   POST /api/swaps
// @access  Private
const createSwapRequest = async (req, res) => {
  try {
    const { receiverId, skillOffered, skillRequested, message } = req.body;

    if (!receiverId || !skillOffered || !skillRequested) {
      return res.status(400).json({ 
        success: false, 
        message: 'Receiver, skill to offer, and skill to learn are required.' 
      });
    }

    if (receiverId.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot send a swap request to yourself.' });
    }

    // Check if duplicate pending request exists
    const existing = await SwapRequest.findOne({
      sender: req.user._id,
      receiver: receiverId,
      status: 'Pending'
    });

    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'You already have a pending swap request with this student.' 
      });
    }

    const swap = await SwapRequest.create({
      sender: req.user._id,
      receiver: receiverId,
      skillOffered,
      skillRequested,
      message: message || `Hey! I can teach ${skillOffered} if you can teach me ${skillRequested}.`
    });

    // Create notification for receiver
    await Notification.create({
      recipient: receiverId,
      sender: req.user._id,
      type: 'SWAP_REQUEST',
      title: 'New SkillSwap Request! 🤝',
      message: `${req.user.name} offered to teach ${skillOffered} in exchange for learning ${skillRequested}.`,
      link: '/requests'
    });

    res.status(201).json({
      success: true,
      message: 'Swap request sent successfully!',
      swap
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all swap requests for current user (sent & received)
// @route   GET /api/swaps
// @access  Private
const getMySwapRequests = async (req, res) => {
  try {
    const incoming = await SwapRequest.find({ receiver: req.user._id })
      .populate('sender', 'name profileImage college branch rating skillCoins teachingSkills')
      .sort({ createdAt: -1 });

    const outgoing = await SwapRequest.find({ sender: req.user._id })
      .populate('receiver', 'name profileImage college branch rating skillCoins teachingSkills')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      incoming,
      outgoing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Respond to swap request (Accept / Reject)
// @route   PUT /api/swaps/:id/respond
// @access  Private
const respondSwapRequest = async (req, res) => {
  try {
    const { action } = req.body; // 'Accept' or 'Reject'
    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap request not found.' });
    }

    if (swap.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not authorized to respond to this request.' });
    }

    if (swap.status !== 'Pending') {
      return res.status(400).json({ success: false, message: `Request is already ${swap.status.toLowerCase()}.` });
    }

    if (action === 'Accept') {
      swap.status = 'Accepted';
      await swap.save();

      // Send notification to sender
      await Notification.create({
        recipient: swap.sender,
        sender: req.user._id,
        type: 'SWAP_ACCEPTED',
        title: 'Swap Request Accepted! 🎉',
        message: `${req.user.name} accepted your request to exchange ${swap.skillOffered} for ${swap.skillRequested}! You can now schedule a session.`,
        link: '/sessions'
      });

      return res.json({
        success: true,
        message: 'Swap request accepted! Ready to schedule sessions.',
        swap
      });
    } else if (action === 'Reject') {
      swap.status = 'Rejected';
      await swap.save();

      await Notification.create({
        recipient: swap.sender,
        sender: req.user._id,
        type: 'SWAP_REJECTED',
        title: 'Swap Request Update',
        message: `${req.user.name} was unable to accept your swap request for ${swap.skillRequested}.`,
        link: '/requests'
      });

      return res.json({
        success: true,
        message: 'Swap request rejected.',
        swap
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action. Must be Accept or Reject.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel an outgoing swap request
// @route   DELETE /api/swaps/:id
// @access  Private
const cancelSwapRequest = async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap request not found.' });
    }

    if (swap.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only cancel requests that you sent.' });
    }

    swap.status = 'Cancelled';
    await swap.save();

    res.json({
      success: true,
      message: 'Swap request cancelled.',
      swap
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSwapRequest,
  getMySwapRequests,
  respondSwapRequest,
  cancelSwapRequest
};
