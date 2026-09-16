import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, Code2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(6, 10, 18, 0.95)',
      borderTop: '1px solid var(--border-glass)',
      padding: '3.5rem 0 2rem',
      color: 'var(--text-secondary)',
      fontSize: '0.875rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Column 1: Brand USP */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem'
              }}>
                ⚡
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
                SkillSwap
              </span>
            </div>
            <p style={{ maxWidth: '320px', lineHeight: 1.6, marginBottom: '1rem' }}>
              A student-driven peer-to-peer learning network. Teach what you know, learn what you need, and exchange skills instead of money.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-indigo">🎓 College Centric</span>
              <span className="badge badge-emerald">🪙 Zero Money</span>
              <span className="badge badge-cyan">🤝 1:1 Mentorship</span>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '1rem' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <Link to="/discover" style={{ color: 'var(--text-secondary)' }}>Discover Skills</Link>
              <Link to="/matches" style={{ color: 'var(--text-secondary)' }}>Smart Matches</Link>
              <Link to="/leaderboard" style={{ color: 'var(--text-secondary)' }}>Campus Leaderboard</Link>
              <Link to="/wallet" style={{ color: 'var(--text-secondary)' }}>SkillCoin Economy</Link>
            </div>
          </div>

          {/* Column 3: Skill Categories */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '1rem' }}>Categories</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <Link to="/discover?category=Programming" style={{ color: 'var(--text-secondary)' }}>Programming</Link>
              <Link to="/discover?category=Design" style={{ color: 'var(--text-secondary)' }}>UI/UX & Design</Link>
              <Link to="/discover?category=AI%20/%20ML" style={{ color: 'var(--text-secondary)' }}>AI & Machine Learning</Link>
              <Link to="/discover?category=Communication" style={{ color: 'var(--text-secondary)' }}>Communication</Link>
            </div>
          </div>

          {/* Column 4: Rule Summary */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '1rem' }}>SkillCoin Rule</h4>
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid var(--border-glass)'
            }}>
              <div style={{ color: '#34d399', fontWeight: '700', marginBottom: '0.35rem' }}>
                +10 Coins / Hour
              </div>
              <p style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>Earned whenever you mentor a fellow college peer.</p>
              <div style={{ color: '#fbbf24', fontWeight: '700', marginBottom: '0.35rem' }}>
                -10 Coins / Hour
              </div>
              <p style={{ fontSize: '0.75rem' }}>Spent when learning a new skill from a peer.</p>
            </div>
          </div>
        </div>

        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            © {new Date().getFullYear()} SkillSwap Network. Built for College Students Worldwide.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Verified Campus Protocol</span>
            <span>Privacy Policy</span>
            <span>Terms of Swap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
