import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#ffffff',
                color: '#111111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '1rem'
              }}>
                ⚡
              </div>
              <span className="footer-brand-title">SkillSwap</span>
            </div>
            <p className="footer-brand-desc">
              The peer-to-peer knowledge network built for university students. Teach what you know, learn what you need, exchange skills instead of money.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Platform</h4>
            <div className="footer-links">
              <Link to="/discover" className="footer-link">Discover Skills</Link>
              <Link to="/matches" className="footer-link">Smart Matches</Link>
              <Link to="/leaderboard" className="footer-link">Campus Leaderboard</Link>
              <Link to="/wallet" className="footer-link">SkillCoin Economy</Link>
            </div>
          </div>

          {/* Categories Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Categories</h4>
            <div className="footer-links">
              <Link to="/discover?category=Programming" className="footer-link">Programming</Link>
              <Link to="/discover?category=Design" className="footer-link">UI/UX & Design</Link>
              <Link to="/discover?category=AI%20/%20ML" className="footer-link">AI & Machine Learning</Link>
              <Link to="/discover?category=Communication" className="footer-link">Communication</Link>
            </div>
          </div>

          {/* System Rules */}
          <div className="footer-column">
            <h4 className="footer-heading">Core Rule</h4>
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.25rem'
            }}>
              <div style={{ color: '#34d399', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                +10 SkillCoins / Hour
              </div>
              <p style={{ fontSize: '0.78rem', color: '#8a8f98', marginBottom: '0.75rem' }}>
                Earned for teaching peers.
              </p>
              <div style={{ color: '#fbbf24', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                -10 SkillCoins / Hour
              </div>
              <p style={{ fontSize: '0.78rem', color: '#8a8f98' }}>
                Invested to learn new skills.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Socials */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} SkillSwap Network. All rights reserved. Built for universities worldwide.
          </div>
          <div className="footer-socials">
            <span className="footer-social-link">Terms</span>
            <span className="footer-social-link">Privacy</span>
            <span className="footer-social-link">Code of Conduct</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
