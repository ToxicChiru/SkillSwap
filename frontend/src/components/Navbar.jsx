import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { 
  LayoutDashboard,
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
  Moon,
  Menu,
  X,
  Home,
  ChevronRight
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const { notifications, unreadCount, markAllRead } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setShowNotifications(false);
    setShowUserMenu(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setShowNotifications(false);
        setShowUserMenu(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Full feature list for authenticated users
  const authNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/discover', label: 'Discover', icon: Compass },
    { path: '/matches', label: 'Matches', icon: Sparkles },
    { path: '/requests', label: 'Requests', icon: ArrowLeftRight },
    { path: '/sessions', label: 'Sessions', icon: Calendar },
    { path: '/wallet', label: 'Wallet', icon: Coins },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  if (isAdmin) {
    authNavItems.push({
      path: '/admin',
      label: 'Admin',
      icon: ShieldAlert,
      isAdminBadge: true
    });
  }

  // Full feature list for public/guest users to explore
  const guestNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/discover', label: 'Discover', icon: Compass },
    { path: '/matches', label: 'Matches', icon: Sparkles },
    { path: '/requests', label: 'Requests', icon: ArrowLeftRight },
    { path: '/sessions', label: 'Sessions', icon: Calendar },
    { path: '/wallet', label: 'Wallet', icon: Coins },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  const currentNavItems = isAuthenticated ? authNavItems : guestNavItems;

  return (
    <div className="navbar-wrapper" ref={navRef}>
      <nav className={`navbar-pill ${scrolled ? 'scrolled' : ''}`}>
        {/* Brand Logo */}
        <Link to="/" className="nav-logo" title="SkillSwap Home">
          <div className="nav-logo-icon">⚡</div>
          <span className="nav-logo-text">SkillSwap</span>
        </Link>

        {/* Desktop Navigation Links - Displays ALL features */}
        <div className="nav-links nav-links-desktop">
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${active ? 'active' : ''} ${item.isAdminBadge ? 'nav-link-admin' : ''}`}
                style={item.isAdminBadge ? { color: 'var(--accent-rose)' } : undefined}
                title={item.label}
              >
                <Icon size={14} className="nav-item-icon" />
                <span className="nav-item-label">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Actions: Theme Toggle, Coins, Notifications, Auth & Mobile Hamburger */}
        <div className="nav-actions">
          {/* Dark / Light Mode Switch */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
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
                    setMobileMenuOpen(false);
                  }}
                  className="theme-toggle-btn"
                  style={{ position: 'relative' }}
                  title="Notifications"
                >
                  <Bell size={15} />
                  {unreadCount > 0 && (
                    <span className="nav-badge-count">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="nav-dropdown nav-dropdown-notifications">
                    <div className="nav-dropdown-header">
                      <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>Notifications</span>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllRead}
                          className="nav-dropdown-action-btn"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="nav-notifications-list">
                      {notifications.length === 0 ? (
                        <p className="nav-empty-state">
                          No notifications yet.
                        </p>
                      ) : (
                        notifications.slice(0, 6).map(n => (
                          <div key={n._id} className="nav-notification-item">
                            <div className="nav-notification-title">{n.title}</div>
                            <div className="nav-notification-desc">{n.message}</div>
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
                    setMobileMenuOpen(false);
                  }}
                  className="nav-avatar-btn"
                  title="Open user menu"
                >
                  <img 
                    src={user?.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'student'}`} 
                    alt={user?.name || 'Student'}
                    className="nav-avatar-img"
                  />
                </button>

                {showUserMenu && (
                  <div className="nav-dropdown nav-dropdown-user">
                    <div className="nav-user-header">
                      <div className="nav-user-name">{user?.name}</div>
                      <div className="nav-user-college">{user?.college || user?.email}</div>
                      <div className="nav-user-coins">🪙 {user?.skillCoins ?? 0} SkillCoins</div>
                    </div>
                    <div className="nav-user-links">
                      <Link to="/dashboard" onClick={() => setShowUserMenu(false)} className="nav-user-menu-item">
                        <LayoutDashboard size={14} /> Dashboard
                      </Link>
                      <Link to="/profile" onClick={() => setShowUserMenu(false)} className="nav-user-menu-item">
                        <UserIcon size={14} /> My Profile
                      </Link>
                      <Link to="/wallet" onClick={() => setShowUserMenu(false)} className="nav-user-menu-item">
                        <Coins size={14} /> Wallet & History
                      </Link>
                      <Link to="/sessions" onClick={() => setShowUserMenu(false)} className="nav-user-menu-item">
                        <Calendar size={14} /> My Sessions
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setShowUserMenu(false)} className="nav-user-menu-item" style={{ color: 'var(--accent-rose)' }}>
                          <ShieldAlert size={14} /> Admin Portal
                        </Link>
                      )}
                      <div className="nav-menu-divider" />
                      <button onClick={handleLogout} className="nav-user-menu-item nav-user-menu-logout">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="nav-auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm btn-pill">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm btn-pill">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="theme-toggle-btn nav-mobile-toggle"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
            title="Toggle Menu"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Responsive Mobile / Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-panel">
          {isAuthenticated && (
            <div className="mobile-user-card">
              <img 
                src={user?.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'student'}`} 
                alt={user?.name}
                className="mobile-user-avatar"
              />
              <div className="mobile-user-info">
                <div className="mobile-user-name">{user?.name}</div>
                <div className="mobile-user-college">{user?.college || 'Student'}</div>
              </div>
              <div className="mobile-coin-badge">
                🪙 {user?.skillCoins ?? 0}
              </div>
            </div>
          )}

          <div className="mobile-nav-items-grid">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-item ${active ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="mobile-nav-item-left">
                    <div className="mobile-nav-item-icon">
                      <Icon size={16} />
                    </div>
                    <span className="mobile-nav-item-label">{item.label}</span>
                  </div>
                  <ChevronRight size={14} className="mobile-nav-item-arrow" />
                </Link>
              );
            })}
          </div>

          <div className="mobile-nav-footer">
            {isAuthenticated ? (
              <div className="mobile-auth-actions">
                <Link 
                  to="/profile" 
                  className="btn btn-secondary btn-sm" 
                  style={{ flex: 1, textAlign: 'center' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            ) : (
              <div className="mobile-auth-actions">
                <Link 
                  to="/login" 
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, textAlign: 'center' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, textAlign: 'center' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
