import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Sparkles, ArrowLeftRight, CheckCircle2, MapPin } from 'lucide-react';

export const MatchCard = ({ match, onRequestSwap }) => {
  const { user, matchScore, theyCanTeachYou, youCanTeachThem, isBilateral } = match;

  // Choose ring/badge color based on score
  const scoreColor = matchScore >= 85 ? '#10b981' : matchScore >= 70 ? '#06b6d4' : '#6366f1';

  return (
    <div className="glass-panel glass-panel-hover" style={{ padding: '1.5rem', position: 'relative' }}>
      {/* Top Bar: Match Score & Bilateral Tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          background: `rgba(${matchScore >= 85 ? '16, 185, 129' : '99, 102, 241'}, 0.15)`,
          border: `1px solid ${scoreColor}`,
          fontWeight: '700',
          fontSize: '0.875rem',
          color: scoreColor
        }}>
          <Sparkles size={14} />
          {matchScore}% Match
        </div>

        {isBilateral && (
          <span className="badge badge-amber" title="Both students teach what the other wants to learn!">
            ⚡ Bilateral Swap
          </span>
        )}
      </div>

      {/* Student Profile Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <img
          src={user.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
          alt={user.name}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            border: '2px solid rgba(255,255,255,0.1)',
            objectFit: 'cover'
          }}
        />
        <div>
          <Link to={`/profile/${user._id}`}>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', transition: 'color 0.2s' }}>
              {user.name}
            </h3>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <MapPin size={12} /> {user.college} • {user.branch}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
            <span style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Star size={13} fill="#fbbf24" /> {user.rating?.toFixed(1) || '5.0'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ({user.totalReviews || 0} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Reciprocal Skills Comparison */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.25)',
        padding: '0.9rem',
        borderRadius: '12px',
        border: '1px solid var(--border-glass)',
        marginBottom: '1.25rem'
      }}>
        {/* They Can Teach You */}
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            They Can Teach You:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {theyCanTeachYou && theyCanTeachYou.length > 0 ? (
              theyCanTeachYou.map((skill, idx) => (
                <span key={idx} className="badge badge-cyan">
                  {skill.name} ({skill.level})
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Explore their teaching list</span>
            )}
          </div>
        </div>

        {/* You Can Teach Them */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            You Can Teach Them:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {youCanTeachThem && youCanTeachThem.length > 0 ? (
              youCanTeachThem.map((skill, idx) => (
                <span key={idx} className="badge badge-indigo">
                  {skill.name}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Any skill from your profile</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={() => onRequestSwap(user, theyCanTeachYou, youCanTeachThem)}
          className="btn btn-primary"
          style={{ flex: 1, fontSize: '0.85rem' }}
        >
          <ArrowLeftRight size={15} /> Propose SkillSwap
        </button>
        <Link
          to={`/profile/${user._id}`}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem' }}
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};
