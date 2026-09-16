# SkillSwap — Peer-to-Peer Skill Exchange Platform

> **"Teach what you know. Learn what you need. Exchange skills instead of money."**

SkillSwap is a web-based, peer-to-peer skill exchange platform designed specifically for college students. It enables students to simultaneously be teachers and learners: students offer skills they are proficient in, earn virtual **SkillCoins**, and redeem those SkillCoins to learn skills from other students.

---

## 🚀 Key Features

* **Authentication & College Profiles**: Secure registration with college, branch, semester, bio, and custom avatar.
* **Skill Directory & Categorization**: Browse skills in Programming, Web Dev, AI/ML, Design, Academics, Languages, and more with proficiency levels (Beginner, Intermediate, Advanced, Expert).
* **Algorithmic Skill Matching**: Smart compatibility matching based on:
  * Skill Overlap (50%)
  * Skill Proficiency Level (20%)
  * Availability (15%)
  * College & Shared Interests (10%)
  * Peer Rating (5%)
* **Swap Request System**: Send, accept, decline, and manage exchange proposals with custom pitch notes.
* **SkillCoin Virtual Economy**:
  * 1 Hour of Teaching = **+10 SkillCoins**
  * 1 Hour of Learning = **-10 SkillCoins**
  * Transparent audit transaction ledger & wallet balance.
* **Session Scheduling & Lifecycle**: Schedule video/in-person sessions, mark completion, trigger automated coin transfer, and cancel/reschedule.
* **Multi-Criteria Rating & Reviews**: Review peers on Knowledge, Communication, and Punctuality with verified session badges.
* **Gamification & Badges**: Earn recognition badges (*First Teacher*, *Skill Mentor*, *Knowledge Sharer*, *Top Contributor*, *Skill Master*) and climb the campus Leaderboard.
* **Admin Dashboard**: Real-time platform analytics, user moderation (verify/ban), and skill catalog management.

---

## 🛠️ Technology Stack

* **Frontend**: React 19, Vite, React Router v7, Vanilla Modern CSS (Glassmorphism & dark aesthetic)
* **Backend**: Node.js, Express.js REST API
* **Database**: MongoDB & Mongoose (with MongoDB Atlas support and zero-config in-memory fallback for local dev)
* **Authentication**: JSON Web Tokens (JWT) & bcrypt.js password hashing

---

## 📂 Architecture & Directory Structure

```text
SkillSwap/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # REST API route handlers
│   ├── middleware/      # Auth & Error handling
│   ├── models/          # Mongoose database schemas
│   ├── routes/          # Express route definitions
│   ├── seed/            # Demo data generator
│   └── server.js        # Express app entry point
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # Reusable UI components & modals
│       ├── context/     # Auth & Notification contexts
│       ├── pages/       # Application views
│       ├── services/    # API client
│       └── styles/      # Design system & modular CSS
├── .gitignore
└── README.md
```

---

## 🚦 Quick Start Guide

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)
* Git

### 1. Clone the repository
```bash
git clone https://github.com/ToxicChiru/SkillSwap.git
cd SkillSwap
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # Pre-populates demo students, skills, swaps, and sessions
npm run dev      # Starts API on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser and log in with any demo persona or register a new student account!
