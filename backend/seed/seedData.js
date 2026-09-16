const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { connectDB, closeDB } = require('../config/db');

const User = require('../models/User');
const Skill = require('../models/Skill');
const SwapRequest = require('../models/SwapRequest');
const Session = require('../models/Session');
const Review = require('../models/Review');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

dotenv.config();

const seedAll = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting SkillSwap database seed...');

    // Clear existing collections
    await User.deleteMany({});
    await Skill.deleteMany({});
    await SwapRequest.deleteMany({});
    await Session.deleteMany({});
    await Review.deleteMany({});
    await Transaction.deleteMany({});
    await Notification.deleteMany({});

    console.log('🧹 Cleaned existing database collections.');

    // 1. Seed Skills Catalog
    const skillsData = [
      { name: 'Python', category: 'Programming', description: 'General-purpose programming, scripting, and backend development.', icon: '🐍', popular: true, teachersCount: 14, learnersCount: 32 },
      { name: 'React.js', category: 'Web Development', description: 'Modern declarative frontend UI library for web apps.', icon: '⚛️', popular: true, teachersCount: 18, learnersCount: 45 },
      { name: 'Figma', category: 'Design', description: 'Industry standard UI/UX design and collaborative prototyping.', icon: '🎨', popular: true, teachersCount: 12, learnersCount: 29 },
      { name: 'UI/UX Design', category: 'Design', description: 'User-centered design principles, wireframing, and usability testing.', icon: '📐', popular: true, teachersCount: 11, learnersCount: 38 },
      { name: 'Machine Learning', category: 'AI / ML', description: 'Supervised & unsupervised learning, scikit-learn, and model training.', icon: '🤖', popular: true, teachersCount: 9, learnersCount: 52 },
      { name: 'Node.js', category: 'Web Development', description: 'Server-side JavaScript runtime for scalable backend APIs.', icon: '🟩', popular: true, teachersCount: 15, learnersCount: 30 },
      { name: 'MongoDB', category: 'Database', description: 'NoSQL document database, Mongoose ODM, and schema design.', icon: '🍃', popular: false, teachersCount: 8, learnersCount: 22 },
      { name: 'Data Structures & Algorithms', category: 'Academics', description: 'Core CS concepts, dynamic programming, trees, graphs for placements.', icon: '💻', popular: true, teachersCount: 25, learnersCount: 60 },
      { name: 'Public Speaking', category: 'Communication', description: 'Confident presentation skills, pitch decks, and interpersonal communication.', icon: '🎙️', popular: true, teachersCount: 7, learnersCount: 35 },
      { name: 'Video Editing', category: 'Video Editing', description: 'Premiere Pro, DaVinci Resolve, transitions, and pacing.', icon: '🎬', popular: false, teachersCount: 6, learnersCount: 24 },
      { name: 'Spanish', category: 'Languages', description: 'Conversational vocabulary, grammar, and pronunciation.', icon: '🇪🇸', popular: false, teachersCount: 4, learnersCount: 18 },
      { name: 'Guitar & Music Theory', category: 'Music', description: 'Chords, fingerpicking, rhythm, and song composition.', icon: '🎸', popular: false, teachersCount: 5, learnersCount: 16 },
      { name: 'Docker & DevOps', category: 'Programming', description: 'Containerization, microservices, and continuous deployment.', icon: '🐳', popular: true, teachersCount: 7, learnersCount: 28 },
      { name: 'Digital Photography', category: 'Photography', description: 'Composition, aperture, shutter speed, and Lightroom color grading.', icon: '📷', popular: false, teachersCount: 6, learnersCount: 19 }
    ];

    await Skill.insertMany(skillsData);
    console.log(`✅ Seeded ${skillsData.length} skills in catalog.`);

    // 2. Seed Users
    // Admin
    const admin = await User.create({
      name: 'Campus Admin',
      email: 'admin@skillswap.edu',
      password: 'adminpassword123',
      college: 'National Central University',
      branch: 'Administration',
      semester: 8,
      role: 'admin',
      bio: 'SkillSwap Platform Administrator & Student Welfare Coordinator',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      skillCoins: 9999,
      isVerified: true
    });

    // Student 1: Aditya (Python & React mentor, wants Figma)
    const aditya = await User.create({
      name: 'Aditya Verma',
      email: 'aditya.python@college.edu',
      password: 'password123',
      college: 'National Institute of Technology',
      branch: 'Computer Science & Engineering',
      semester: 6,
      bio: 'Full-stack developer passionate about open source and teaching code. Looking to master Figma and UI/UX to build slick interfaces.',
      profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      skillCoins: 120,
      rating: 4.9,
      totalReviews: 8,
      ratingBreakdown: { knowledge: 5.0, communication: 4.8, punctuality: 4.9 },
      teachingHours: 18,
      learningHours: 6,
      completedSessions: 18,
      teachingSkills: [
        { name: 'Python', category: 'Programming', level: 'Expert', experience: '3 years' },
        { name: 'React.js', category: 'Web Development', level: 'Advanced', experience: '2 years' },
        { name: 'MongoDB', category: 'Database', level: 'Intermediate', experience: '1.5 years' }
      ],
      learningSkills: [
        { name: 'Figma', category: 'Design', priority: 'High' },
        { name: 'UI/UX Design', category: 'Design', priority: 'High' },
        { name: 'Public Speaking', category: 'Communication', priority: 'Medium' }
      ],
      availability: [
        { day: 'Monday', slots: ['18:00 - 19:00', '19:00 - 20:00'] },
        { day: 'Wednesday', slots: ['18:00 - 19:00'] },
        { day: 'Saturday', slots: ['14:00 - 16:00'] }
      ],
      badges: [
        { id: 'first-teacher', name: 'First Teacher', icon: '🌟', description: 'Completed their first teaching session' },
        { id: 'skill-mentor', name: 'Skill Mentor', icon: '🎓', description: 'Offered 3+ skills on campus' },
        { id: 'top-contributor', name: 'Top Contributor', icon: '⭐', description: 'Maintained 4.8+ rating across reviews' },
        { id: 'knowledge-sharer', name: 'Knowledge Sharer', icon: '🔥', description: '15+ hours of peer teaching' }
      ]
    });

    // Student 2: Ananya (Figma & UI/UX designer, wants Python/React) -> PERFECT MATCH WITH ADITYA!
    const ananya = await User.create({
      name: 'Ananya Sharma',
      email: 'ananya.design@college.edu',
      password: 'password123',
      college: 'National Institute of Technology',
      branch: 'Information Technology',
      semester: 6,
      bio: 'Design enthusiast who loves typography, visual hierarchy, and creating seamless digital products. Want to learn Python for backend automation.',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      skillCoins: 90,
      rating: 4.8,
      totalReviews: 6,
      ratingBreakdown: { knowledge: 4.9, communication: 4.9, punctuality: 4.7 },
      teachingHours: 12,
      learningHours: 8,
      completedSessions: 14,
      teachingSkills: [
        { name: 'Figma', category: 'Design', level: 'Expert', experience: '2.5 years' },
        { name: 'UI/UX Design', category: 'Design', level: 'Advanced', experience: '2 years' },
        { name: 'Video Editing', category: 'Video Editing', level: 'Intermediate', experience: '1 year' }
      ],
      learningSkills: [
        { name: 'Python', category: 'Programming', priority: 'High' },
        { name: 'React.js', category: 'Web Development', priority: 'High' }
      ],
      availability: [
        { day: 'Monday', slots: ['18:00 - 19:00', '20:00 - 21:00'] },
        { day: 'Thursday', slots: ['17:00 - 18:00'] },
        { day: 'Saturday', slots: ['14:00 - 16:00'] }
      ],
      badges: [
        { id: 'first-teacher', name: 'First Teacher', icon: '🌟', description: 'Completed their first teaching session' },
        { id: 'skill-mentor', name: 'Skill Mentor', icon: '🎓', description: 'Offered 3+ skills on campus' },
        { id: 'top-contributor', name: 'Top Contributor', icon: '⭐', description: 'Maintained 4.8+ rating across reviews' }
      ]
    });

    // Student 3: Rahul (AI/ML specialist, wants React/Web Dev)
    const rahul = await User.create({
      name: 'Rahul Mehta',
      email: 'rahul.ai@college.edu',
      password: 'password123',
      college: 'Indian Institute of Information Technology',
      branch: 'Artificial Intelligence & Data Science',
      semester: 7,
      bio: 'Deep learning researcher and Kaggle competitor. Building neural networks by day, looking to learn web development to deploy ML prototypes.',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      skillCoins: 70,
      rating: 4.7,
      totalReviews: 5,
      ratingBreakdown: { knowledge: 5.0, communication: 4.5, punctuality: 4.6 },
      teachingHours: 10,
      learningHours: 4,
      completedSessions: 10,
      teachingSkills: [
        { name: 'Machine Learning', category: 'AI / ML', level: 'Expert', experience: '3 years' },
        { name: 'Python', category: 'Programming', level: 'Advanced', experience: '2.5 years' },
        { name: 'Data Structures & Algorithms', category: 'Academics', level: 'Advanced', experience: '2 years' }
      ],
      learningSkills: [
        { name: 'React.js', category: 'Web Development', priority: 'High' },
        { name: 'Figma', category: 'Design', priority: 'Medium' }
      ],
      availability: [
        { day: 'Tuesday', slots: ['19:00 - 20:00'] },
        { day: 'Saturday', slots: ['16:00 - 18:00'] },
        { day: 'Sunday', slots: ['10:00 - 12:00'] }
      ],
      badges: [
        { id: 'first-teacher', name: 'First Teacher', icon: '🌟', description: 'Completed their first teaching session' },
        { id: 'skill-mentor', name: 'Skill Mentor', icon: '🎓', description: 'Offered 3+ skills on campus' }
      ]
    });

    // Student 4: Sneha (Cloud & Backend, wants Machine Learning)
    const sneha = await User.create({
      name: 'Sneha Patel',
      email: 'sneha.cloud@college.edu',
      password: 'password123',
      college: 'National Institute of Technology',
      branch: 'Computer Science & Engineering',
      semester: 5,
      bio: 'Backend enthusiast, Docker lover, and AWS Certified Cloud Practitioner. Excited to learn applied Machine Learning.',
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      skillCoins: 65,
      rating: 4.9,
      totalReviews: 4,
      ratingBreakdown: { knowledge: 4.9, communication: 5.0, punctuality: 4.8 },
      teachingHours: 8,
      learningHours: 5,
      completedSessions: 7,
      teachingSkills: [
        { name: 'Node.js', category: 'Web Development', level: 'Advanced', experience: '2 years' },
        { name: 'Docker & DevOps', category: 'Programming', level: 'Intermediate', experience: '1 year' },
        { name: 'MongoDB', category: 'Database', level: 'Intermediate', experience: '1 year' }
      ],
      learningSkills: [
        { name: 'Machine Learning', category: 'AI / ML', priority: 'High' },
        { name: 'Public Speaking', category: 'Communication', priority: 'Medium' }
      ],
      availability: [
        { day: 'Wednesday', slots: ['18:00 - 19:00'] },
        { day: 'Friday', slots: ['17:00 - 19:00'] }
      ],
      badges: [
        { id: 'first-teacher', name: 'First Teacher', icon: '🌟', description: 'Completed their first teaching session' }
      ]
    });

    // Student 5: Kiran (Music & Spanish, wants Video Editing)
    const kiran = await User.create({
      name: 'Kiran Kumar',
      email: 'kiran.music@college.edu',
      password: 'password123',
      college: 'Delhi College of Arts',
      branch: 'Music & Humanities',
      semester: 4,
      bio: 'Acoustic guitarist and bilingual speaker. Sharing rhythm, melody, and Spanish conversation with anyone looking for a creative outlet.',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      skillCoins: 55,
      rating: 4.6,
      totalReviews: 3,
      ratingBreakdown: { knowledge: 4.7, communication: 4.6, punctuality: 4.5 },
      teachingHours: 6,
      learningHours: 4,
      completedSessions: 5,
      teachingSkills: [
        { name: 'Guitar & Music Theory', category: 'Music', level: 'Expert', experience: '5 years' },
        { name: 'Spanish', category: 'Languages', level: 'Intermediate', experience: '2 years' }
      ],
      learningSkills: [
        { name: 'Video Editing', category: 'Video Editing', priority: 'High' },
        { name: 'Digital Photography', category: 'Photography', priority: 'Medium' }
      ],
      availability: [
        { day: 'Monday', slots: ['17:00 - 18:00'] },
        { day: 'Saturday', slots: ['11:00 - 13:00'] }
      ],
      badges: [
        { id: 'first-teacher', name: 'First Teacher', icon: '🌟', description: 'Completed their first teaching session' }
      ]
    });

    console.log('✅ Seeded 6 Users (Admin + 5 Diverse Student Personas).');

    // 3. Seed Transactions
    await Transaction.create([
      { user: aditya._id, type: 'Bonus', amount: 50, reason: 'Welcome bonus for joining SkillSwap!', balanceAfter: 50 },
      { user: aditya._id, type: 'Earned', amount: 10, reason: 'Taught Python for 1 hour to Ananya Sharma', balanceAfter: 60 },
      { user: aditya._id, type: 'Spent', amount: 10, reason: 'Learned Figma for 1 hour from Ananya Sharma', balanceAfter: 50 },
      { user: aditya._id, type: 'Earned', amount: 10, reason: 'Taught React.js for 1 hour to Rahul Mehta', balanceAfter: 60 },
      { user: ananya._id, type: 'Bonus', amount: 50, reason: 'Welcome bonus for joining SkillSwap!', balanceAfter: 50 },
      { user: ananya._id, type: 'Earned', amount: 10, reason: 'Taught Figma for 1 hour to Aditya Verma', balanceAfter: 60 },
      { user: ananya._id, type: 'Spent', amount: 10, reason: 'Learned Python for 1 hour from Aditya Verma', balanceAfter: 50 }
    ]);
    console.log('✅ Seeded SkillCoin wallet transactions.');

    // 4. Seed Swap Requests
    const swap1 = await SwapRequest.create({
      sender: ananya._id,
      receiver: aditya._id,
      skillOffered: 'Figma',
      skillRequested: 'React.js',
      message: 'Hey Aditya! Loved your React repo. I can teach you Figma design systems in exchange for modern React hooks.',
      status: 'Accepted'
    });

    await SwapRequest.create({
      sender: rahul._id,
      receiver: aditya._id,
      skillOffered: 'Machine Learning',
      skillRequested: 'Python',
      message: 'Hi Aditya, would love to review Python data structures together.',
      status: 'Pending'
    });

    await SwapRequest.create({
      sender: sneha._id,
      receiver: rahul._id,
      skillOffered: 'Node.js',
      skillRequested: 'Machine Learning',
      message: 'Hey Rahul, want to swap Node.js backend patterns for your ML foundations?',
      status: 'Pending'
    });
    console.log('✅ Seeded Swap Requests.');

    // 5. Seed Scheduled & Past Sessions
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 3);

    const upcomingSession = await Session.create({
      teacher: aditya._id,
      learner: ananya._id,
      skill: 'React.js',
      date: tomorrow,
      startTime: '19:00',
      endTime: '20:00',
      durationHours: 1,
      meetingLink: 'https://meet.google.com/skillswap-react-aditya',
      notes: 'Focus on Custom Hooks, Context API, and state optimization.',
      status: 'Scheduled',
      swapRequest: swap1._id
    });

    const completedSession = await Session.create({
      teacher: ananya._id,
      learner: aditya._id,
      skill: 'Figma',
      date: pastDate,
      startTime: '18:00',
      endTime: '19:00',
      durationHours: 1,
      meetingLink: 'https://meet.google.com/skillswap-figma-ananya',
      notes: 'Auto-layout, typography scales, and responsive design systems.',
      status: 'Completed',
      hasReview: true,
      swapRequest: swap1._id
    });
    console.log('✅ Seeded Sessions (Upcoming & Completed).');

    // 6. Seed Review
    await Review.create({
      session: completedSession._id,
      reviewer: aditya._id,
      reviewedUser: ananya._id,
      skill: 'Figma',
      ratings: {
        knowledge: 5,
        communication: 5,
        punctuality: 5
      },
      overallRating: 5.0,
      comment: 'Ananya is phenomenal! She broke down complex Auto-Layout and Component variants step by step. I feel 10x more confident in Figma now.'
    });
    console.log('✅ Seeded Review for completed session.');

    // 7. Seed Notifications
    await Notification.create([
      {
        recipient: aditya._id,
        sender: ananya._id,
        type: 'SWAP_ACCEPTED',
        title: 'Swap Request Accepted! 🎉',
        message: 'Ananya Sharma accepted your exchange request for Figma ↔ React.js!',
        link: '/sessions',
        isRead: false
      },
      {
        recipient: aditya._id,
        sender: rahul._id,
        type: 'SWAP_REQUEST',
        title: 'New Swap Request! 🤝',
        message: 'Rahul Mehta offered to teach Machine Learning for Python.',
        link: '/requests',
        isRead: false
      },
      {
        recipient: aditya._id,
        sender: null,
        type: 'SESSION_SCHEDULED',
        title: 'Upcoming Session Tomorrow 📅',
        message: 'React.js session with Ananya Sharma tomorrow at 19:00.',
        link: '/sessions',
        isRead: false
      }
    ]);
    console.log('✅ Seeded Notifications.');

    console.log('🎉 Database seeding completed successfully!');
    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedAll();
