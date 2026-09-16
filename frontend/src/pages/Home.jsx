import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Coins, 
  Calendar, 
  Star, 
  Video, 
  Plus, 
  ShieldCheck, 
  Users, 
  Clock,
  ChevronDown
} from 'lucide-react';

export const Home = () => {
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();

  // FAQ open state
  const [openFaq, setOpenFaq] = useState(0);

  // Scroll Progress Percentage (0 - 100)
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll-linked 3D Mockup Perspective Tilt
  const [mockupTransform, setMockupTransform] = useState({
    rotateX: 14,
    scale: 0.93,
    translateY: 28
  });

  // Listen to scroll to drive 3D Mockup unfolding tilt and hairline scrollbar
  useEffect(() => {
    let rafId;
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);

      // Smoothly unfold mockup from 14deg tilt down to 0deg as user scrolls down the hero
      const factor = Math.min(1, Math.max(0, scrollY / 440));
      const rotateX = 14 * (1 - factor);
      const scale = 0.93 + (0.07 * factor);
      const translateY = 28 * (1 - factor);

      setMockupTransform({ rotateX, scale, translateY });
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // IntersectionObserver to trigger smooth scroll reveal transitions
  useEffect(() => {
    const elements = document.querySelectorAll(
      '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleQuickDemo = async (email) => {
    try {
      await demoLogin(email);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const faqItems = [
    {
      q: "How does the SkillCoin virtual credit system operate?",
      a: "SkillCoins are purely virtual credits designed to facilitate reciprocal learning without real money. Every new student receives 50 bonus coins upon registration. Whenever you mentor a peer for 1 hour, you earn +10 SkillCoins. Whenever you learn from a peer, 10 SkillCoins are transferred to your tutor once the session is marked completed."
    },
    {
      q: "Is SkillSwap completely free for college students?",
      a: "Yes. SkillSwap is 100% free. The core principle is 'Teach what you know, learn what you need, exchange skills instead of money.' You never have to connect a credit card or pay subscription fees."
    },
    {
      q: "How does the matching algorithm determine compatibility scores?",
      a: "Our algorithm calculates compatibility using a 5-factor weighted scoring formula: Skill Compatibility (50% for reciprocal teaching/learning overlap), Skill Proficiency Level (20% for Advanced/Expert depth), Weekly Availability (15% for matching slots), College & Department (10% for campus familiarity), and Peer Rating (5% based on verified reviews)."
    },
    {
      q: "Can I teach multiple skills or learn multiple topics simultaneously?",
      a: "Absolutely. Students can add as many teaching skills with proficiency levels (Beginner, Intermediate, Advanced, Expert) and learning wishlist topics as they desire. The matching algorithm continuously scans for all your active preferences."
    },
    {
      q: "How are sessions conducted?",
      a: "When a swap request is accepted, either student can schedule a 1-hour session by selecting a date, time slot, and meeting link (such as Google Meet or a campus study room). Upon session completion, both participants verify the exchange and leave multi-criteria reviews."
    }
  ];

  return (
    <div style={{ position: 'relative' }}>
      {/* Top Viewport Hairline Scroll Progress Bar */}
      <div className="scroll-progress-container">
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Background ambient glow */}
      <div className="glow" style={{ top: '-100px', left: '50%', transform: 'translateX(-50%)' }} />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          {/* Eyebrow */}
          <div className="eyebrow hero-eyebrow">
            <span>⚡ Peer-to-Peer Knowledge Exchange</span>
          </div>

          {/* Editorial Display Heading */}
          <h1 className="hero-title">
            Teach what you know.<br />
            <em>Learn what you need.</em>
          </h1>

          {/* Supporting Paragraph */}
          <p className="hero-paragraph">
            A peer-driven exchange platform for university students. Exchange practical skills without money, 
            earn virtual SkillCoins, and learn directly from campus peers.
          </p>

          {/* CTA Buttons */}
          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg btn-pill">
                Go to Student Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg btn-pill">
                  Get Started Free <ArrowRight size={16} />
                </Link>
                <Link to="/discover" className="btn btn-secondary btn-lg btn-pill">
                  Explore Skills Catalog
                </Link>
              </>
            )}
          </div>

          {/* 1-Click Demo Login Bar */}
          {!isAuthenticated && (
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-pill)',
              padding: '0.5rem 1.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: 'var(--shadow-subtle)',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Instant Test Logins:
              </span>
              <button
                type="button"
                onClick={() => handleQuickDemo('aditya.python@college.edu')}
                className="btn btn-secondary btn-sm btn-pill"
              >
                👨‍💻 Aditya (Python)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('ananya.design@college.edu')}
                className="btn btn-secondary btn-sm btn-pill"
              >
                🎨 Ananya (Figma)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('rahul.ai@college.edu')}
                className="btn btn-secondary btn-sm btn-pill"
              >
                🤖 Rahul (AI/ML)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@skillswap.edu')}
                className="btn btn-secondary btn-sm btn-pill"
                style={{ color: 'var(--accent-rose)' }}
              >
                🛡️ Admin
              </button>
            </div>
          )}

          {/* Animated Scroll Down Indicator */}
          <div
            className="scroll-indicator"
            onClick={() => window.scrollTo({ top: 680, behavior: 'smooth' })}
            title="Scroll to explore"
          >
            <div className="scroll-indicator-mouse">
              <div className="scroll-indicator-wheel" />
            </div>
            <span>Scroll to explore</span>
          </div>

          {/* Large Elevated CSS Product Mockup with Scroll-Linked 3D Transition */}
          <div className="mockup-3d-stage">
            <div
              className="mockup mockup-3d-card"
              style={{
                transform: `rotateX(${mockupTransform.rotateX}deg) scale(${mockupTransform.scale}) translateY(${mockupTransform.translateY}px)`
              }}
            >
              {/* Browser Header */}
              <div className="mockup-header">
                <div className="mockup-controls">
                  <div className="mockup-dot" style={{ background: '#ff5f56' }} />
                  <div className="mockup-dot" style={{ background: '#ffbd2e' }} />
                  <div className="mockup-dot" style={{ background: '#27c93f' }} />
                </div>
                <div className="mockup-url-bar">
                  skillswap.edu/dashboard
                </div>
              </div>

              {/* Mockup Dashboard Content */}
              <div className="mockup-body">
                {/* Sidebar */}
                <div className="mockup-sidebar">
                  <div className="mockup-nav-item active">
                    <span>⚡</span> Dashboard
                  </div>
                  <div className="mockup-nav-item">
                    <span>✨</span> Smart Matches
                  </div>
                  <div className="mockup-nav-item">
                    <span>📅</span> Sessions
                  </div>
                  <div className="mockup-nav-item">
                    <span>🪙</span> Wallet
                  </div>
                  <div className="mockup-nav-item">
                    <span>🏆</span> Leaderboard
                  </div>
                </div>

                {/* Main View */}
                <div className="mockup-main">
                  {/* Top Bar */}
                  <div className="mockup-top-banner">
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: '600' }}>
                        Welcome back, Aditya Verma
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        National Institute of Technology • Semester 6
                      </p>
                    </div>
                    <div className="coin-pill">
                      <span>🪙</span> 120 SkillCoins
                    </div>
                  </div>

                  {/* 3 Metric Cards */}
                  <div className="mockup-stats-row">
                    <div className="mockup-stat-box">
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                        Teaching Hours
                      </span>
                      <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text)', marginTop: '0.25rem' }}>
                        18 hrs
                      </div>
                    </div>
                    <div className="mockup-stat-box">
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                        Completed Swaps
                      </span>
                      <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text)', marginTop: '0.25rem' }}>
                        18
                      </div>
                    </div>
                    <div className="mockup-stat-box">
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                        Campus Rating
                      </span>
                      <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text)', marginTop: '0.25rem' }}>
                        4.9 ⭐
                      </div>
                    </div>
                  </div>

                  {/* Bilateral Match Showcase inside Mockup */}
                  <div className="mockup-match-preview">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                        alt="Ananya"
                        style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <strong style={{ fontSize: '0.925rem', color: 'var(--text)' }}>Ananya Sharma</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                          Teaches: Figma, UI/UX • Wants: Python, React
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="badge badge-emerald" style={{ fontWeight: '700' }}>
                        96% Compatibility
                      </span>
                      <span className="btn btn-primary btn-sm btn-pill">
                        Swap Proposed ✓
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Understated Monochrome Logo Cloud with Scroll Reveal */}
      <section className="logo-cloud-section scroll-reveal">
        <div className="container">
          <div className="logo-cloud-label">
            Adopted by students across leading academic institutions
          </div>
          <div className="logo-cloud-grid">
            <span className="logo-item scroll-reveal-scale stagger-1">MIT</span>
            <span className="logo-item scroll-reveal-scale stagger-2">STANFORD</span>
            <span className="logo-item scroll-reveal-scale stagger-3">UC BERKELEY</span>
            <span className="logo-item scroll-reveal-scale stagger-4">OXFORD</span>
            <span className="logo-item scroll-reveal-scale stagger-5">CAMBRIDGE</span>
            <span className="logo-item scroll-reveal-scale stagger-6">IIT</span>
            <span className="logo-item scroll-reveal-scale stagger-6">ETH ZÜRICH</span>
          </div>
        </div>
      </section>

      {/* Alternating Two-Column Features with Scroll-Driven Reveal */}
      <section className="section-large">
        <div className="container">
          <div className="features-container">
            {/* Feature 1 */}
            <div className="feature scroll-reveal">
              <div className="feature-text scroll-reveal-left">
                <span className="eyebrow" style={{ marginBottom: '1rem' }}>
                  Smart Matching
                </span>
                <h2 className="feature-heading">
                  Find peers who want what you teach, and teach what you need.
                </h2>
                <p className="feature-description">
                  Our multi-factor algorithmic engine evaluates reciprocal skills, proficiency levels, 
                  weekly availability schedules, and academic department overlap to connect you with your ideal study partner.
                </p>
                <Link to="/matches" className="btn btn-secondary btn-pill">
                  Explore Algorithmic Matches <ArrowRight size={15} />
                </Link>
              </div>

              <div className="feature-visual scroll-reveal-right">
                <div className="card float-hover" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '1.1rem' }}>Scoring Breakdown</h4>
                    <span className="badge badge-emerald">96% Overall</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span>Skill Overlap</span>
                        <strong>50 / 50%</strong>
                      </div>
                      <div style={{ height: '6px', background: 'var(--surface-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div className="scoring-bar-fill" style={{ '--target-width': '100%' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span>Skill Level Depth</span>
                        <strong>20 / 20%</strong>
                      </div>
                      <div style={{ height: '6px', background: 'var(--surface-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div className="scoring-bar-fill" style={{ '--target-width': '100%' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span>Availability Schedule</span>
                        <strong>15 / 15%</strong>
                      </div>
                      <div style={{ height: '6px', background: 'var(--surface-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div className="scoring-bar-fill" style={{ '--target-width': '100%' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span>Campus & Department</span>
                        <strong>10 / 10%</strong>
                      </div>
                      <div style={{ height: '6px', background: 'var(--surface-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div className="scoring-bar-fill" style={{ '--target-width': '100%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 (Reverse) */}
            <div className="feature reverse scroll-reveal">
              <div className="feature-text scroll-reveal-right">
                <span className="eyebrow" style={{ marginBottom: '1rem' }}>
                  SkillCoin Economy
                </span>
                <h2 className="feature-heading">
                  Earn credits for teaching. Spend them to master new tools.
                </h2>
                <p className="feature-description">
                  Every hour you spend mentoring a fellow student credits your wallet with +10 SkillCoins. 
                  Redeem those credits to book 1-on-1 practical sessions with experienced peers.
                </p>
                <Link to="/wallet" className="btn btn-secondary btn-pill">
                  View SkillCoin Ledger <ArrowRight size={15} />
                </Link>
              </div>

              <div className="feature-visual scroll-reveal-left">
                <div className="card float-hover" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h4 style={{ fontSize: '1.1rem' }}>Recent Ledger Activity</h4>
                    <span className="coin-pill">🪙 Balance: 120</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--surface-secondary)', borderRadius: '10px' }}>
                      <span>Taught Python to Ananya</span>
                      <strong style={{ color: 'var(--accent-emerald)' }}>+10 🪙</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--surface-secondary)', borderRadius: '10px' }}>
                      <span>Learned Figma from Ananya</span>
                      <strong style={{ color: 'var(--accent-rose)' }}>-10 🪙</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--surface-secondary)', borderRadius: '10px' }}>
                      <span>Taught React to Rahul</span>
                      <strong style={{ color: 'var(--accent-emerald)' }}>+10 🪙</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="feature scroll-reveal">
              <div className="feature-text scroll-reveal-left">
                <span className="eyebrow" style={{ marginBottom: '1rem' }}>
                  Structured Sessions
                </span>
                <h2 className="feature-heading">
                  Schedule, meet, and build verified campus reputation.
                </h2>
                <p className="feature-description">
                  Lock in mutually agreed session agendas, connect through integrated Google Meet rooms, 
                  and receive ratings across Knowledge, Communication, and Punctuality.
                </p>
                <Link to="/leaderboard" className="btn btn-secondary btn-pill">
                  Browse Campus Leaderboard <ArrowRight size={15} />
                </Link>
              </div>

              <div className="feature-visual scroll-reveal-right">
                <div className="card float-hover" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <span className="badge badge-indigo" style={{ marginBottom: '0.35rem' }}>Scheduled Session</span>
                      <h4 style={{ fontSize: '1.15rem' }}>React.js Architecture</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tomorrow at 19:00 • 1 Hour</span>
                    </div>
                    <span className="badge badge-emerald">Verified</span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    "Focus on Custom Hooks, Context API, and modern state optimization."
                  </p>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <span className="btn btn-secondary btn-sm btn-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Video size={14} /> Google Meet Room
                    </span>
                    <span className="btn btn-primary btn-sm btn-pill">
                      Review Pending
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist FAQ Accordion Section with Scroll Reveal */}
      <section className="faq-section scroll-reveal">
        <div className="container faq-container">
          <div className="faq-header scroll-reveal-scale">
            <span className="eyebrow" style={{ marginBottom: '1rem' }}>
              Common Inquiries
            </span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Everything you need to know about peer skill exchange on campus.
            </p>
          </div>

          <div className="faq-list">
            {faqItems.map((item, idx) => (
              <div 
                key={idx} 
                className={`faq-item scroll-reveal stagger-${Math.min(idx + 1, 6)} ${openFaq === idx ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                >
                  <span>{item.q}</span>
                  <span className="faq-icon">
                    <Plus size={16} />
                  </span>
                </button>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
