const User = require('../models/User');

// Calculate match score between two students
const calculateMatchScore = (userA, userB) => {
  let score = 0;
  const breakdown = {
    skillCompatibility: 0,
    levelCompatibility: 0,
    availability: 0,
    commonInterests: 0,
    rating: 0
  };

  const userALearning = (userA.learningSkills || []).map(s => s.name.toLowerCase());
  const userATeaching = (userA.teachingSkills || []).map(s => s.name.toLowerCase());
  const userBLearning = (userB.learningSkills || []).map(s => s.name.toLowerCase());
  const userBTeaching = (userB.teachingSkills || []).map(s => s.name.toLowerCase());

  // Skills User B can teach User A
  const bCanTeachA = (userB.teachingSkills || []).filter(s => 
    userALearning.includes(s.name.toLowerCase())
  );

  // Skills User A can teach User B
  const aCanTeachB = (userA.teachingSkills || []).filter(s => 
    userBLearning.includes(s.name.toLowerCase())
  );

  // 1. Skill Compatibility (Max 50 pts)
  let skillPts = 0;
  if (bCanTeachA.length > 0 && aCanTeachB.length > 0) {
    // Bilateral perfect swap!
    skillPts = 50;
  } else if (bCanTeachA.length > 0) {
    skillPts = 30 + Math.min(bCanTeachA.length * 5, 10);
  } else if (aCanTeachB.length > 0) {
    skillPts = 25 + Math.min(aCanTeachB.length * 5, 10);
  }
  breakdown.skillCompatibility = Math.min(skillPts, 50);

  // 2. Skill Level Compatibility (Max 20 pts)
  let levelPts = 10;
  if (bCanTeachA.length > 0) {
    const highestLevel = bCanTeachA.reduce((max, s) => {
      const levels = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
      const val = levels[s.level] || 2;
      return Math.max(max, val);
    }, 1);

    if (highestLevel === 4) levelPts = 20;
    else if (highestLevel === 3) levelPts = 18;
    else if (highestLevel === 2) levelPts = 14;
    else levelPts = 10;
  }
  breakdown.levelCompatibility = levelPts;

  // 3. Availability Compatibility (Max 15 pts)
  let availPts = 8;
  const daysA = (userA.availability || []).map(a => a.day);
  const daysB = (userB.availability || []).map(a => a.day);
  const commonDays = daysA.filter(d => daysB.includes(d));
  if (commonDays.length >= 2) {
    availPts = 15;
  } else if (commonDays.length === 1) {
    availPts = 12;
  }
  breakdown.availability = availPts;

  // 4. Common College / Department (Max 10 pts)
  let campusPts = 0;
  if (userA.college && userB.college && userA.college.toLowerCase() === userB.college.toLowerCase()) {
    campusPts += 6;
  } else {
    campusPts += 2;
  }
  if (userA.branch && userB.branch && userA.branch.toLowerCase() === userB.branch.toLowerCase()) {
    campusPts += 4;
  } else {
    campusPts += 2;
  }
  breakdown.commonInterests = Math.min(campusPts, 10);

  // 5. Rating (Max 5 pts)
  const ratingPts = ((userB.rating || 5) / 5) * 5;
  breakdown.rating = Math.round(ratingPts * 10) / 10;

  score = Math.min(
    Math.round(
      breakdown.skillCompatibility +
      breakdown.levelCompatibility +
      breakdown.availability +
      breakdown.commonInterests +
      breakdown.rating
    ),
    100
  );

  return {
    score,
    breakdown,
    bCanTeachA,
    aCanTeachB,
    isBilateral: bCanTeachA.length > 0 && aCanTeachB.length > 0
  };
};

// @desc    Get recommended skill matches for logged-in student
// @route   GET /api/matches
// @access  Private
const getRecommendedMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find all other active students
    const candidates = await User.find({
      _id: { $ne: currentUser._id },
      isBanned: false,
      role: 'student'
    }).select('-password');

    const matches = candidates.map(candidate => {
      const matchResult = calculateMatchScore(currentUser, candidate);
      return {
        user: candidate,
        matchScore: matchResult.score,
        breakdown: matchResult.breakdown,
        theyCanTeachYou: matchResult.bCanTeachA,
        youCanTeachThem: matchResult.aCanTeachB,
        isBilateral: matchResult.isBilateral
      };
    })
    .filter(match => match.matchScore >= 40) // Meaningful matches
    .sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      count: matches.length,
      matches
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRecommendedMatches,
  calculateMatchScore
};
