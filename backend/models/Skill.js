const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Programming',
      'Web Development',
      'AI / ML',
      'Database',
      'Design',
      'Academics',
      'Languages',
      'Music',
      'Photography',
      'Video Editing',
      'Communication',
      'Other'
    ],
    default: 'Other'
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: '⚡'
  },
  popular: {
    type: Boolean,
    default: false
  },
  teachersCount: {
    type: Number,
    default: 0
  },
  learnersCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema);
