import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { SessionCard } from '../components/SessionCard';
import { ReviewModal } from '../components/ReviewModal';
import { ScheduleModal } from '../components/ScheduleModal';
import { Calendar, Plus, Clock, CheckCircle2 } from 'lucide-react';

export const Sessions = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useNotification();

  const [sessions, setSessions] = useState([]);
  const [tab, setTab] = useState('Scheduled'); // 'Scheduled', 'Completed', 'Cancelled'
  const [reviewSession, setReviewSession] = useState(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await api.get('/sessions');
      setSessions(data.sessions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleComplete = async (sessionId) => {
    try {
      await api.put(`/sessions/${sessionId}/complete`);
      showToast('Session completed! 10 SkillCoins transferred successfully.', 'success');
      await refreshUser();
      fetchSessions();
    } catch (err) {
      showToast(err.message || 'Failed to complete session.', 'error');
    }
  };

  const filteredSessions = sessions.filter(s => {
    if (tab === 'Scheduled') return s.status === 'Scheduled';
    if (tab === 'Completed') return s.status === 'Completed';
    return s.status === 'Cancelled';
  });

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.35rem' }}>Learning Sessions</h1>
          <p>Schedule, join, and complete your 1-on-1 practical peer tutoring exchanges.</p>
        </div>

        {/* SkillCoin Notice */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '12px',
          padding: '0.65rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.825rem',
          color: '#fbbf24'
        }}>
          <span>🪙</span>
          <span>Completing a session transfers <strong>10 SkillCoins</strong> from learner to teacher.</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        borderBottom: '1px solid var(--border-glass)',
        marginBottom: '2rem'
      }}>
        {['Scheduled', 'Completed', 'Cancelled'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: tab === t ? '3px solid var(--accent-primary)' : '3px solid transparent',
              padding: '0.75rem 1.5rem',
              color: tab === t ? '#ffffff' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            {t === 'Scheduled' && <Calendar size={18} />}
            {t === 'Completed' && <CheckCircle2 size={18} />}
            {t === 'Cancelled' && <Clock size={18} />}
            {t} ({sessions.filter(s => s.status === t).length})
          </button>
        ))}
      </div>

      {/* Sessions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            Loading sessions...
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center' }}>
            <Calendar size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h3>No {tab.toLowerCase()} sessions found</h3>
            <p style={{ maxWidth: '400px', margin: '0.5rem auto 0' }}>
              {tab === 'Scheduled' 
                ? "You have no upcoming sessions scheduled. Accept a swap request to schedule a 1:1 session!" 
                : `No ${tab.toLowerCase()} sessions recorded in your history.`}
            </p>
          </div>
        ) : (
          filteredSessions.map(session => (
            <SessionCard
              key={session._id}
              session={session}
              onComplete={handleComplete}
              onReview={(s) => setReviewSession(s)}
            />
          ))
        )}
      </div>

      {/* Review Modal */}
      {reviewSession && (
        <ReviewModal
          session={reviewSession}
          onClose={() => setReviewSession(null)}
          onSuccess={fetchSessions}
        />
      )}
    </div>
  );
};
