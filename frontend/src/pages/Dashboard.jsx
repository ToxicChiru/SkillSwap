import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { MatchCard } from '../components/MatchCard';
import { SwapModal } from '../components/SwapModal';
import { ReviewModal } from '../components/ReviewModal';
import { 
  Coins, 
  Sparkles, 
  Calendar, 
  Award, 
  Clock, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  Video, 
  BookOpen, 
  GraduationCap 
} from 'lucide-react';

export const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useNotification();

  const [matches, setMatches] = useState([]);
  const [upcomingSession, setUpcomingSession] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [reviewingSession, setReviewingSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch matches
      const matchData = await api.get('/matches');
      setMatches((matchData.matches || []).slice(0, 3));

      // Fetch upcoming session
      const sessionData = await api.get('/sessions');
      const upcoming = (sessionData.sessions || []).find(s => s.status === 'Scheduled');
      setUpcomingSession(upcoming || null);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCompleteSession = async (sessionId) => {
    try {
      await api.put(`/sessions/${sessionId}/complete`);
      showToast('Session marked as completed! 10 SkillCoins transferred.', 'success');
      await refreshUser();
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to complete session.', 'error');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Welcome Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '2.2rem' }}>Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
            <span className="badge badge-indigo">{user?.college}</span>
          </div>
          <p style={{ fontSize: '0.95rem' }}>
            {user?.branch} • Semester {user?.semester} • Student ID verified
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/discover" className="btn btn-secondary">
            <BookOpen size={16} /> Discover Skills
          </Link>
          <Link to="/matches" className="btn btn-primary">
            <Sparkles size={16} /> View All Matches
          </Link>
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        {/* Wallet Pill Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              SkillCoin Wallet
            </span>
            <span style={{ fontSize: '1.5rem' }}>🪙</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fbbf24', fontFamily: 'var(--font-heading)' }}>
            {user?.skillCoins ?? 50}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#fcd34d', marginTop: '0.25rem' }}>
            +10 for teaching • -10 for learning
          </div>
          <Link to="/wallet" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.75rem', fontWeight: '600' }}>
            Manage Wallet <ArrowRight size={13} />
          </Link>
        </div>

        {/* Teaching Hours */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Teaching Hours
            </span>
            <GraduationCap size={22} color="#10b981" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#34d399', fontFamily: 'var(--font-heading)' }}>
            {user?.teachingHours || 0} hrs
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Delivered to peer students
          </div>
        </div>

        {/* Learning Sessions */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Completed Swaps
            </span>
            <CheckCircle2 size={22} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#22d3ee', fontFamily: 'var(--font-heading)' }}>
            {user?.completedSessions || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Total 1:1 verified sessions
          </div>
        </div>

        {/* Average Rating */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Campus Rating
            </span>
            <Star size={22} fill="#fbbf24" color="#fbbf24" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fbbf24', fontFamily: 'var(--font-heading)' }}>
            {user?.rating?.toFixed(1) || '5.0'} ⭐
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Based on {user?.totalReviews || 0} peer evaluations
          </div>
        </div>
      </div>

      {/* Upcoming Session Spotlight */}
      {upcomingSession && (
        <div className="glass-panel" style={{
          padding: '1.5rem 2rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          marginBottom: '3rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.3rem'
              }}>
                📅
              </div>
              <div>
                <span className="badge badge-emerald" style={{ marginBottom: '0.25rem' }}>
                  Next Scheduled Session
                </span>
                <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>
                  {upcomingSession.skill} Session
                </h3>
                <p style={{ fontSize: '0.85rem' }}>
                  with {upcomingSession.teacher?._id === user?._id ? upcomingSession.learner?.name : upcomingSession.teacher?.name} •{' '}
                  {new Date(upcomingSession.date).toLocaleDateString()} at {upcomingSession.startTime}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href={upcomingSession.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                <Video size={16} /> Enter Meeting Room
              </a>
              <button
                onClick={() => handleCompleteSession(upcomingSession._id)}
                className="btn btn-success"
              >
                <CheckCircle2 size={16} /> Mark Completed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout: Skills Summary & Recommended Matches */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Left Column: My Skills Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Teaching Skills */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#34d399' }}>Skills I Can Teach</h3>
              <Link to={`/profile/${user?._id}`} style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
                Edit Skills
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {user?.teachingSkills?.map((s, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(0, 0, 0, 0.2)',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px'
                }}>
                  <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{s.name}</span>
                  <span className="badge badge-emerald">{s.level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Wishlist */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#22d3ee' }}>Skills I Want to Learn</h3>
              <Link to={`/profile/${user?._id}`} style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
                Edit Wishlist
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {user?.learningSkills?.map((s, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(0, 0, 0, 0.2)',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px'
                }}>
                  <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{s.name}</span>
                  <span className="badge badge-cyan">{s.priority} Priority</span>
                </div>
              ))}
            </div>
          </div>

          {/* Earned Badges */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Badges Earned</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {user?.badges?.map((b, idx) => (
                <span key={idx} className="badge badge-amber" title={b.description} style={{ padding: '0.4rem 0.75rem' }}>
                  {b.icon} {b.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Top Recommended Matches */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem' }}>Top Algorithmic Matches</h2>
              <p style={{ fontSize: '0.825rem' }}>Students with reciprocal learning & teaching synergy</p>
            </div>
            <Link to="/matches" className="btn btn-secondary btn-sm">
              View All Matches <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {matches.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <p>No matches computed yet. Try adding more skills to your teaching and learning profile!</p>
              </div>
            ) : (
              matches.map((match, idx) => (
                <MatchCard
                  key={idx}
                  match={match}
                  onRequestSwap={(partner) => setSelectedMatch(partner)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedMatch && (
        <SwapModal
          partner={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onSuccess={loadDashboardData}
        />
      )}

      {reviewingSession && (
        <ReviewModal
          session={reviewingSession}
          onClose={() => setReviewingSession(null)}
          onSuccess={loadDashboardData}
        />
      )}
    </div>
  );
};
