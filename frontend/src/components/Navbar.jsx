import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { 
  Compass, 
  Sparkles, 
  ArrowLeftRight, 
  Calendar, 
  Coins, 
  Trophy, 
  ShieldAlert, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Sun, 
  Moon 
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { notifications, unreadCount, markAllRead } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar-wrapper">
      <nav className={`navbar-pill ${scrolled ? 'scrolled' : ''}`}>
        {/* Brand Logo */}
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">⚡</div>
          <span className="nav-logo-text">SkillSwap</span>
        </Link>

        {/* Center Navigation Links */}
        <div className="nav-links nav-links-desktop">
          <Link 
            to="/discover" 
            className={`nav-link ${isActive('/discover') ? 'active' : ''}`}
          >
            <Compass size={15} /> Discover
          </Link>

          {isAuthenticated && (
            <>
              <Link 
                to="/matches" 
                className={`nav-link ${isActive('/matches') ? 'active' : ''}`}
              >
                <Sparkles size={15} /> Matches
              </Link>

              <Link 
                to="/requests" 
                className={`nav-link ${isActive('/requests') ? 'active' : ''}`}
              >
                <ArrowLeftRight size={15} /> Requests
              </Link>

              <Link 
                to="/sessions" 
                className={`nav-link ${isActive('/sessions') ? 'active' : ''}`}
              >
                <Calendar size={15} /> Sessions
              </Link>

              <Link 
                to="/wallet" 
                className={`nav-link ${isActive('/wallet') ? 'active' : ''}`}
              >
                <Coins size={15} /> Wallet
              </Link>
            </>
          )}

          <Link 
            to="/leaderboard" 
            className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}
          >
            <Trophy size={15} /> Leaderboard
          </Link>

          {isAdmin && (
            <Link 
              to="/admin" 
              className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
              style={{ color: 'var(--accent-rose)' }}
            >
              <ShieldAlert size={15} /> Admin
            </Link>
          )}
        </div>

        {/* Right Actions: Theme Toggle, Coins, Notifications, Auth */}
        <div className="nav-actions">
          {/* Dark / Light Mode Switch */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {isAuthenticated ? (
            <>
              {/* SkillCoin Balance */}
              <Link to="/wallet" className="coin-pill" title="Your SkillCoin Balance">
                <span>🪙</span>
                <span>{user?.skillCoins ?? 0}</span>
              </Link>

              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                  className="theme-toggle-btn"
                  style={{ position: 'relative' }}
                >
                  <Bell size={16} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      background: 'var(--accent-rose)',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: '700',
                      borderRadius: '9999px',
                      padding: '1px 4px',
                      lineHeight: 1
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div style={{
                    position: 'absolute',
                    top: '44px',
                    right: 0,
                    width: '300px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-card)',
                    padding: '1rem',
                    zIndex: 200,
                    animation: 'fadeUp 0.15s ease-out'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>Notifications</span>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllRead}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                          No notifications yet.
                        </p>
                      ) : (
                        notifications.slice(0, 5).map(n => (
                          <div 
                            key={n._id} 
                            style={{
                              padding: '0.5rem',
                              borderBottom: '1px solid var(--border)',
                              fontSize: '0.8rem'
                            }}
                          >
                            <div style={{ fontWeight: '600', color: 'var(--text)' }}>{n.title}</div>
                            <div style={{ color: 'var(--text-secondary)' }}>{n.message}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar Menu */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <img 
                    src={user?.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'student'}`} 
                    alt={user?.name}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      border: '1px solid var(--border)',
                      objectFit: 'cover'
                    }} 
                  />
                </button>

                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '44px',
                    right: 0,
                    width: '200px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-card)',
                    padding: '0.75rem',
                    zIndex: 200,
                    animation: 'fadeUp 0.15s ease-out'
                  }}>
                    <div style={{ padding: '0.35rem 0.5rem', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{user?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.college}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.5rem' }}>
                      <Link 
                        to="/dashboard" 
                        onClick={() => setShowUserMenu(false)}
                        style={{ padding: '0.45rem 0.5rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to={`/profile/${user?._id}`} 
                        onClick={() => setShowUserMenu(false)}
                        style={{ padding: '0.45rem 0.5rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}
                      >
                        My Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        style={{
                          background: 'none',
                          border: 'none',
                          textAlign: 'left',
                          padding: '0.45rem 0.5rem',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          color: 'var(--accent-rose)',
                          cursor: 'pointer'
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm btn-pill">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm btn-pill">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};
