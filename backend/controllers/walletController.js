const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get current user's wallet overview & transaction ledger
// @route   GET /api/wallet
// @access  Private
const getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('skillCoins teachingHours learningHours completedSessions');
    
    const transactions = await Transaction.find({ user: req.user._id })
      .populate('session', 'skill date startTime')
      .sort({ createdAt: -1 });

    const totalEarned = transactions
      .filter(t => t.type === 'Earned' || t.type === 'Bonus')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalSpent = transactions
      .filter(t => t.type === 'Spent')
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      success: true,
      wallet: {
        balance: user.skillCoins,
        totalEarned,
        totalSpent,
        teachingHours: user.teachingHours,
        learningHours: user.learningHours,
        completedSessions: user.completedSessions,
        transactions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Transfer SkillCoins to another student (peer tip or custom exchange)
// @route   POST /api/wallet/transfer
// @access  Private
const transferCoins = async (req, res) => {
  try {
    const { recipientId, amount, reason } = req.body;
    const transferAmount = Number(amount);

    if (!recipientId || !transferAmount || transferAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid recipient and positive coin amount required.' });
    }

    if (recipientId.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot transfer coins to yourself.' });
    }

    const sender = await User.findById(req.user._id);
    if (sender.skillCoins < transferAmount) {
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient SkillCoins. You have ${sender.skillCoins} coins, but tried to transfer ${transferAmount}.` 
      });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient student not found.' });
    }

    // Deduct from sender
    sender.skillCoins -= transferAmount;
    await sender.save();

    await Transaction.create({
      user: sender._id,
      type: 'Spent',
      amount: transferAmount,
      reason: `Transferred to ${recipient.name}: ${reason || 'Peer tip'}`,
      balanceAfter: sender.skillCoins
    });

    // Credit to recipient
    recipient.skillCoins += transferAmount;
    await recipient.save();

    await Transaction.create({
      user: recipient._id,
      type: 'Earned',
      amount: transferAmount,
      reason: `Received from ${sender.name}: ${reason || 'Peer tip'}`,
      balanceAfter: recipient.skillCoins
    });

    // Notify recipient
    await Notification.create({
      recipient: recipient._id,
      sender: sender._id,
      type: 'COINS_EARNED',
      title: 'SkillCoins Received! 🪙',
      message: `${sender.name} sent you ${transferAmount} SkillCoins! Note: ${reason || 'Peer tip'}`,
      link: '/wallet'
    });

    res.json({
      success: true,
      message: `Successfully transferred ${transferAmount} SkillCoins to ${recipient.name}!`,
      newBalance: sender.skillCoins
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWallet,
  transferCoins
};
