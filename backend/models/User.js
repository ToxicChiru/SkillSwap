const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teachingSkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], 
    default: 'Intermediate' 
  },
  experience: { type: String, default: '1+ years' }
}, { _id: false });

const learningSkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  priority: { 
    type: String, 
    enum: ['High', 'Medium', 'Low'], 
    default: 'High' 
  }
}, { _id: false });

const availabilitySchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g., 'Monday', 'Saturday'
  slots: [{ type: String }] // e.g., ['18:00 - 19:00', '19:00 - 20:00']
}, { _id: false });

const badgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  icon: { type: String, default: '🏆' },
  description: { type: String },
  awardedAt: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  college: {
    type: String,
    default: 'National Institute of Technology'
  },
  branch: {
    type: String,
    default: 'Computer Science & Engineering'
  },
  semester: {
    type: Number,
    default: 5
  },
  profileImage: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: 'Passionate student eager to learn and share knowledge with peers!'
  },
  teachingSkills: [teachingSkillSchema],
  learningSkills: [learningSkillSchema],
  availability: [availabilitySchema],
  rating: {
    type: Number,
    default: 5.0,
    min: 1,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  ratingBreakdown: {
    knowledge: { type: Number, default: 5.0 },
    communication: { type: Number, default: 5.0 },
    punctuality: { type: Number, default: 5.0 }
  },
  skillCoins: {
    type: Number,
    default: 50 // Welcoming gift for new students
  },
  teachingHours: {
    type: Number,
    default: 0
  },
  learningHours: {
    type: Number,
    default: 0
  },
  completedSessions: {
    type: Number,
    default: 0
  },
  badges: [badgeSchema],
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  isBanned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Password hash middleware before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Helper to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
