const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillOffered: {
    type: String,
    required: [true, 'Please specify the skill you can teach']
  },
  skillRequested: {
    type: String,
    required: [true, 'Please specify the skill you want to learn']
  },
  message: {
    type: String,
    default: 'Hi! I would love to exchange skills with you.'
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed'],
    default: 'Pending'
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
