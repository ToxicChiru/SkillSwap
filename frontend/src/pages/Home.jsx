import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { SkillCard } from '../components/SkillCard';
import { 
  Sparkles, 
  ArrowLeftRight, 
  Coins, 
  CheckCircle, 
  GraduationCap, 
  Star, 
  Users, 
  TrendingUp, 
  Zap,
  ArrowRight
} from 'lucide-react';

export const Home = () => {
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [popularSkills, setPopularSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await api.get('/skills?popular=true');
        setPopularSkills((data.skills || []).slice(0, 8));
      } catch (err) {
        console.error(err);
      }
    };
    fetchSkills();
  }, []);

  const handleQuickDemo = async (email) => {
    try {
      await demoLogin(email);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Hero Section */}
      <section style={{
        padding: '5rem 0 6rem',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="container">
          {/* Tag Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '9999px',
            padding: '0.4rem 1rem',
            color: '#818cf8',
            fontSize: '0.85rem',
            fontWeight: '700',
            marginBottom: '1.75rem',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            <Sparkles size={16} /> Campus Peer-to-Peer Learning Network
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            lineHeight: 1.15,
            maxWidth: '900px',
            margin: '0 auto 1.5rem',
            letterSpacing: '-0.03em'
          }}>
            Teach what you know.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Learn what you need.
            </span>
          </h1>

          <p style={{
            fontSize: '1.25rem',
            maxWidth: '680px',
            margin: '0 auto 2.5rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}>
            Exchange skills instead of money. Connect with students on your campus and beyond, 
            schedule 1:1 learning sessions, earn virtual <strong>SkillCoins</strong>, and accelerate your practical knowledge.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '3rem'
          }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Student Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Join Your Campus <ArrowRight size={18} />
                </Link>
                <Link to="/discover" className="btn btn-secondary btn-lg">
                  Browse Skills Directory
                </Link>
              </>
            )}
          </div>

          {/* Quick Demo Login Bar for Evaluators */}
          {!isAuthenticated && (
            <div style={{
              maxWidth: '640px',
              margin: '0 auto',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px dashed var(--border-glass-hover)',
              borderRadius: '16px',
              padding: '1.25rem',
              backdropFilter: 'blur(12px)'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '0.75rem' }}>
                🚀 Try Instant Demo Accounts (1-Click Test Login):
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleQuickDemo('aditya.python@college.edu')}
                  className="btn btn-secondary btn-sm"
                  style={{ border: '1px solid rgba(99, 102, 241, 0.4)', color: '#818cf8' }}
                >
                  👨‍💻 Aditya (Python/React)
                </button>
                <button
                  onClick={() => handleQuickDemo('ananya.design@college.edu')}
                  className="btn btn-secondary btn-sm"
                  style={{ border: '1px solid rgba(6, 182, 212, 0.4)', color: '#22d3ee' }}
                >
                  🎨 Ananya (Figma/UI)
                </button>
                <button
                  onClick={() => handleQuickDemo('rahul.ai@college.edu')}
                  className="btn btn-secondary btn-sm"
                  style={{ border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399' }}
                >
                  🤖 Rahul (AI/ML)
                </button>
                <button
                  onClick={() => handleQuickDemo('admin@skillswap.edu')}
                  className="btn btn-secondary btn-sm"
                  style={{ border: '1px solid rgba(244, 63, 94, 0.4)', color: '#fb7185' }}
                >
                  🛡️ Campus Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Live Campus Metrics Strip */}
      <section style={{
        background: 'rgba(14, 22, 38, 0.6)',
        borderTop: '1px solid var(--border-glass)',
        borderBottom: '1px solid var(--border-glass)',
        padding: '2.5rem 0'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#818cf8', fontFamily: 'var(--font-heading)' }}>
                650+
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                Active College Peers
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#22d3ee', fontFamily: 'var(--font-heading)' }}>
                85+
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                Skills Offered
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                1,420 hrs
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                Peer Learning Exchanged
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fbbf24', fontFamily: 'var(--font-heading)' }}>
                4.9 ⭐
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                Average Peer Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Concept / USP Section */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>
              The Zero-Money Skill Economy
            </span>
            <h2>How the SkillSwap Ecosystem Works</h2>
            <p style={{ maxWidth: '600px', margin: '0.75rem auto 0' }}>
              Students are simultaneously teachers and learners. Our algorithmic engine matches complementary skills so you can learn without paying a single dollar.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem'
          }}>
            {/* Step 1 */}
            <div className="glass-panel" style={{ padding: '2rem 1.5rem', position: 'relative' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: '800',
                marginBottom: '1.25rem'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>List Your Skills</h3>
              <p style={{ fontSize: '0.875rem' }}>
                Specify what you can teach (e.g. Python, React) and what you want to learn (e.g. Figma, UI/UX).
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel" style={{ padding: '2rem 1.5rem', position: 'relative' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#22d3ee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: '800',
                marginBottom: '1.25rem'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Smart Match</h3>
              <p style={{ fontSize: '0.875rem' }}>
                Our 5-factor matching algorithm pairs you with students who want what you teach and teach what you need.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel" style={{ padding: '2rem 1.5rem', position: 'relative' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: '800',
                marginBottom: '1.25rem'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>1:1 Sessions</h3>
              <p style={{ fontSize: '0.875rem' }}>
                Send swap proposals, agree on an agenda, and schedule 1-hour sessions with Google Meet integration.
              </p>
            </div>

            {/* Step 4 */}
            <div className="glass-panel" style={{ padding: '2rem 1.5rem', position: 'relative' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: '800',
                marginBottom: '1.25rem'
              }}>
                4
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>SkillCoins & Badges</h3>
              <p style={{ fontSize: '0.875rem' }}>
                Earn +10 SkillCoins for teaching, spend 10 coins to learn, collect verified ratings, and top the leaderboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reciprocal Bilateral Swap Showcase (Aditya ↔ Ananya) */}
      <section style={{ padding: '0 0 6rem' }}>
        <div className="container">
          <div className="glass-panel" style={{
            padding: '3rem',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 27, 75, 0.5) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            position: 'relative'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>Real Campus Scenario</span>
              <h2>How Aditya & Ananya Exchanged Skills</h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: '2rem',
              alignItems: 'center'
            }}>
              {/* Student A: Aditya */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"
                    alt="Aditya"
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ color: '#fff' }}>Aditya Verma</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NIT Trichy • CSE</span>
                  </div>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: '700' }}>TEACHES (+10 Coins):</span>
                  <div style={{ marginTop: '0.25rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-emerald">Python (Expert)</span>
                    <span className="badge badge-emerald">React.js (Advanced)</span>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#22d3ee', fontWeight: '700' }}>WANTS TO LEARN:</span>
                  <div style={{ marginTop: '0.25rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-cyan">Figma</span>
                    <span className="badge badge-cyan">UI/UX Design</span>
                  </div>
                </div>
              </div>

              {/* Center Match Score Ring */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
                  margin: '0 auto 0.75rem'
                }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: '800', lineHeight: 1 }}>96%</span>
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: '700' }}>Match</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: '600' }}>
                  ⚡ Perfect Bilateral Swap!
                </div>
              </div>

              {/* Student B: Ananya */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                    alt="Ananya"
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ color: '#fff' }}>Ananya Sharma</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NIT Trichy • Design</span>
                  </div>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: '700' }}>TEACHES (+10 Coins):</span>
                  <div style={{ marginTop: '0.25rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-emerald">Figma (Expert)</span>
                    <span className="badge badge-emerald">UI/UX (Advanced)</span>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#22d3ee', fontWeight: '700' }}>WANTS TO LEARN:</span>
                  <div style={{ marginTop: '0.25rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-cyan">Python</span>
                    <span className="badge badge-cyan">React.js</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Skills Catalog Preview */}
      <section style={{ padding: '0 0 6rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>Popular Skills</span>
              <h2>Explore Skills in Demand</h2>
            </div>
            <Link to="/discover" className="btn btn-secondary btn-sm">
              View All Skills Catalog <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-4">
            {popularSkills.map(skill => (
              <SkillCard key={skill._id} skill={skill} onSelect={() => navigate(`/discover?search=${skill.name}`)} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
