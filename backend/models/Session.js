const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  learner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skill: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true,
    default: '18:00'
  },
  endTime: {
    type: String,
    required: true,
    default: '19:00'
  },
  durationHours: {
    type: Number,
    default: 1
  },
  coinsTransferred: {
    type: Number,
    default: 10
  },
  meetingLink: {
    type: String,
    default: 'https://meet.google.com/xyz-skill-swap'
  },
  location: {
    type: String,
    default: 'Online (Google Meet)'
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
    default: 'Scheduled'
  },
  swapRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SwapRequest'
  },
  hasReview: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Session', sessionSchema);
