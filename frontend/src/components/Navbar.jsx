import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  Menu, 
  X 
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { notifications, unreadCount, markAllRead } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: 'rgba(8, 12, 21, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-glass)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>
            ⚡
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: '800',
              background: 'linear-gradient(to right, #ffffff, #cbd5e1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}>
              Skill<span style={{ color: '#6366f1', WebkitTextFillColor: '#818cf8' }}>Swap</span>
            </span>
            <span style={{
              display: 'block',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              marginTop: '-3px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Campus Peer Exchange
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          display: mobileMenuOpen ? 'flex' : 'none'
        }} className="nav-links-desktop">
          <Link 
            to="/discover" 
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: isActive('/discover') ? '#818cf8' : 'var(--text-secondary)',
              background: isActive('/discover') ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s'
            }}
          >
            <Compass size={17} /> Discover
          </Link>

          {isAuthenticated && (
            <>
              <Link 
                to="/matches" 
                style={{
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: isActive('/matches') ? '#22d3ee' : 'var(--text-secondary)',
                  background: isActive('/matches') ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s'
                }}
              >
                <Sparkles size={17} /> Matches
              </Link>

              <Link 
                to="/requests" 
                style={{
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: isActive('/requests') ? '#818cf8' : 'var(--text-secondary)',
                  background: isActive('/requests') ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s'
                }}
              >
                <ArrowLeftRight size={17} /> Requests
              </Link>

              <Link 
                to="/sessions" 
                style={{
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: isActive('/sessions') ? '#34d399' : 'var(--text-secondary)',
                  background: isActive('/sessions') ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s'
                }}
              >
                <Calendar size={17} /> Sessions
              </Link>

              <Link 
                to="/wallet" 
                style={{
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: isActive('/wallet') ? '#fbbf24' : 'var(--text-secondary)',
                  background: isActive('/wallet') ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s'
                }}
              >
                <Coins size={17} /> Wallet
              </Link>
            </>
          )}

          <Link 
            to="/leaderboard" 
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: isActive('/leaderboard') ? '#f43f5e' : 'var(--text-secondary)',
              background: isActive('/leaderboard') ? 'rgba(244, 63, 94, 0.12)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s'
            }}
          >
            <Trophy size={17} /> Leaderboard
          </Link>

          {isAdmin && (
            <Link 
              to="/admin" 
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#fb7185',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <ShieldAlert size={17} /> Admin
            </Link>
          )}
        </div>

        {/* Right Side: Auth / Wallet & Notifications */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              {/* SkillCoin Wallet Pill */}
              <Link to="/wallet" className="coin-pill" title="Your SkillCoin Balance">
                <span>🪙</span>
                <span>{user?.skillCoins ?? 0}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Coins</span>
              </Link>

              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-glass)',
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: 'var(--accent-rose)',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 'bold',
                      borderRadius: '9999px',
                      padding: '1px 5px',
                      boxShadow: '0 0 8px rgba(244, 63, 94, 0.6)'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div style={{
                    position: 'absolute',
                    top: '48px',
                    right: 0,
                    width: '320px',
                    background: '#0d1527',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '14px',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '1rem',
                    zIndex: 200,
                    animation: 'scaleUp 0.15s ease-out'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Notifications</span>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllRead}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-cyan)',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                          No notifications yet.
                        </p>
                      ) : (
                        notifications.slice(0, 5).map(n => (
                          <div 
                            key={n._id} 
                            style={{
                              padding: '0.6rem 0.5rem',
                              borderBottom: '1px solid rgba(255,255,255,0.05)',
                              background: n.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.08)',
                              borderRadius: '6px',
                              marginBottom: '4px'
                            }}
                          >
                            <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-primary)' }}>{n.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{n.message}</div>
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
                    gap: '0.6rem',
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                >
                  <img 
                    src={user?.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'student'}`} 
                    alt={user?.name}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      border: '2px solid var(--accent-primary)',
                      objectFit: 'cover'
                    }} 
                  />
                </button>

                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '48px',
                    right: 0,
                    width: '220px',
                    background: '#0d1527',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '14px',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.75rem',
                    zIndex: 200,
                    animation: 'scaleUp 0.15s ease-out'
                  }}>
                    <div style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{user?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.college}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                      <Link 
                        to="/dashboard" 
                        onClick={() => setShowUserMenu(false)}
                        style={{ padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <UserIcon size={16} /> Dashboard
                      </Link>
                      <Link 
                        to={`/profile/${user?._id}`} 
                        onClick={() => setShowUserMenu(false)}
                        style={{ padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <UserIcon size={16} /> My Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        style={{
                          background: 'none',
                          border: 'none',
                          textAlign: 'left',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          color: '#fb7185',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
