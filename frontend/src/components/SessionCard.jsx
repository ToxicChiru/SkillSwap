import React from 'react';
import { Calendar, Clock, Video, CheckCircle2, Star, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SessionCard = ({ session, onComplete, onReview }) => {
  const { user } = useAuth();

  const isTeacher = session.teacher?._id === user?._id;
  const partner = isTeacher ? session.learner : session.teacher;

  const sessionDate = new Date(session.date).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const statusBadgeClass = 
    session.status === 'Completed' ? 'badge-emerald' :
    session.status === 'Cancelled' ? 'badge-rose' : 'badge-indigo';

  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <span className={`badge ${statusBadgeClass}`} style={{ marginBottom: '0.4rem' }}>
            {session.status}
          </span>
          <h4 style={{ fontSize: '1.15rem' }}>{session.skill}</h4>
        </div>
        <span className="badge badge-amber" style={{ fontSize: '0.8rem' }}>
          {isTeacher ? '🎓 You are Teaching (+10)' : '📖 You are Learning (-10)'}
        </span>
      </div>

      {/* Partner details */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '0.65rem 0.85rem',
        borderRadius: '10px',
        marginBottom: '1rem'
      }}>
        <img
          src={partner?.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${partner?.name || 'partner'}`}
          alt={partner?.name}
          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>
            {partner?.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {partner?.college} • {partner?.branch}
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Calendar size={15} color="#818cf8" /> {sessionDate}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock size={15} color="#22d3ee" /> {session.startTime} - {session.endTime}
        </div>
      </div>

      {session.notes && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', fontStyle: 'italic' }}>
          "{session.notes}"
        </p>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        {session.meetingLink && session.status !== 'Cancelled' && (
          <a
            href={session.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Video size={14} /> Join Meeting
          </a>
        )}

        {session.status === 'Scheduled' && (
          <button
            onClick={() => onComplete(session._id)}
            className="btn btn-success btn-sm"
          >
            <CheckCircle2 size={14} /> Mark Completed
          </button>
        )}

        {session.status === 'Completed' && !session.hasReview && (
          <button
            onClick={() => onReview(session)}
            className="btn btn-primary btn-sm"
          >
            <Star size={14} fill="#ffffff" /> Leave Review
          </button>
        )}

        {session.status === 'Completed' && session.hasReview && (
          <span style={{ fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CheckCircle2 size={14} /> Review Submitted
          </span>
        )}
      </div>
    </div>
  );
};
