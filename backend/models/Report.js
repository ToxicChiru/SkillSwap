const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    enum: ['No show for scheduled session', 'Inappropriate behavior', 'False skill claims', 'Harassment', 'Spam', 'Other'],
    required: true
  },
  details: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Resolved', 'Dismissed'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
