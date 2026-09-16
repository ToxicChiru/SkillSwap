const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Earned', 'Spent', 'Bonus', 'AdminAdjustment'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  balanceAfter: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
