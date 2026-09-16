const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skill: {
    type: String,
    default: ''
  },
  ratings: {
    knowledge: { type: Number, required: true, min: 1, max: 5 },
    communication: { type: Number, required: true, min: 1, max: 5 },
    punctuality: { type: Number, required: true, min: 1, max: 5 }
  },
  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please provide feedback in your review'],
    maxlength: 500
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
