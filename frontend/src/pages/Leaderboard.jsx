import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Trophy, Award, Star, GraduationCap, Coins, Medal } from 'lucide-react';

export const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [category, setCategory] = useState('sessions'); // 'sessions', 'teachingHours', 'coins', 'rating'
  const [loading, setLoading] = useState(true);

  const fetchLeaders = async () => {
    try {
      setLoading(true);
      const data = await api.get('/users/leaderboard', { category });
      setLeaders(data.leaders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, [category]);

  const badgesList = [
    { icon: '🌱', name: 'New Explorer', desc: 'Joined the SkillSwap campus learning network' },
    { icon: '🌟', name: 'First Teacher', desc: 'Successfully completed their first peer teaching session' },
    { icon: '🎓', name: 'Skill Mentor', desc: 'Offered 3 or more skills to teach fellow students' },
    { icon: '🔥', name: 'Knowledge Sharer', desc: 'Completed 5+ peer teaching sessions' },
    { icon: '⭐', name: 'Top Contributor', desc: 'Maintained 4.8+ rating across multiple reviews' },
    { icon: '👑', name: 'Skill Master', desc: 'Completed 10+ peer sessions with campus commendation' }
  ];

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: '9999px',
          padding: '0.35rem 0.85rem',
          color: '#fb7185',
          fontSize: '0.85rem',
          fontWeight: '700',
          marginBottom: '1rem'
        }}>
          <Trophy size={16} /> Campus Hall of Fame
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Student Leaderboard</h1>
        <p style={{ maxWidth: '580px', margin: '0 auto' }}>
          Celebrating top tutors, active learners, and community mentors across universities.
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
        marginBottom: '3rem'
      }}>
        <button
          onClick={() => setCategory('sessions')}
          className={`btn btn-sm ${category === 'sessions' ? 'btn-primary' : 'btn-secondary'}`}
        >
          🏆 Most Sessions
        </button>
        <button
          onClick={() => setCategory('teachingHours')}
          className={`btn btn-sm ${category === 'teachingHours' ? 'btn-primary' : 'btn-secondary'}`}
        >
          ⏱️ Teaching Hours
        </button>
        <button
          onClick={() => setCategory('coins')}
          className={`btn btn-sm ${category === 'coins' ? 'btn-primary' : 'btn-secondary'}`}
        >
          🪙 SkillCoins
        </button>
        <button
          onClick={() => setCategory('rating')}
          className={`btn btn-sm ${category === 'rating' ? 'btn-primary' : 'btn-secondary'}`}
        >
          ⭐ Highest Rating
        </button>
      </div>

      {/* Top 3 Podium (if leaders available) */}
      {leaders.length >= 3 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr 1fr',
          gap: '1.5rem',
          alignItems: 'flex-end',
          maxWidth: '840px',
          margin: '0 auto 3.5rem'
        }}>
          {/* Rank 2 */}
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🥈</div>
            <img
              src={leaders[1].profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${leaders[1].name}`}
              alt={leaders[1].name}
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 0.5rem' }}
            />
            <h4 style={{ color: '#fff', fontSize: '1rem' }}>{leaders[1].name}</h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{leaders[1].college}</div>
            <div style={{ marginTop: '0.5rem', fontWeight: '700', color: '#22d3ee' }}>
              {category === 'sessions' && `${leaders[1].completedSessions} Sessions`}
              {category === 'teachingHours' && `${leaders[1].teachingHours} Hours`}
              {category === 'coins' && `${leaders[1].skillCoins} Coins`}
              {category === 'rating' && `${leaders[1].rating?.toFixed(1)} ⭐`}
            </div>
          </div>

          {/* Rank 1 */}
          <div className="glass-panel" style={{
            padding: '2rem 1.5rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
            border: '2px solid rgba(245, 158, 11, 0.4)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>👑</div>
            <img
              src={leaders[0].profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${leaders[0].name}`}
              alt={leaders[0].name}
              style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 0.5rem', border: '3px solid #fbbf24' }}
            />
            <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>{leaders[0].name}</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{leaders[0].college}</div>
            <div style={{ marginTop: '0.75rem', fontWeight: '800', color: '#fbbf24', fontSize: '1.2rem' }}>
              {category === 'sessions' && `${leaders[0].completedSessions} Sessions`}
              {category === 'teachingHours' && `${leaders[0].teachingHours} Hours`}
              {category === 'coins' && `${leaders[0].skillCoins} Coins`}
              {category === 'rating' && `${leaders[0].rating?.toFixed(1)} ⭐`}
            </div>
          </div>

          {/* Rank 3 */}
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🥉</div>
            <img
              src={leaders[2].profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${leaders[2].name}`}
              alt={leaders[2].name}
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 0.5rem' }}
            />
            <h4 style={{ color: '#fff', fontSize: '1rem' }}>{leaders[2].name}</h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{leaders[2].college}</div>
            <div style={{ marginTop: '0.5rem', fontWeight: '700', color: '#34d399' }}>
              {category === 'sessions' && `${leaders[2].completedSessions} Sessions`}
              {category === 'teachingHours' && `${leaders[2].teachingHours} Hours`}
              {category === 'coins' && `${leaders[2].skillCoins} Coins`}
              {category === 'rating' && `${leaders[2].rating?.toFixed(1)} ⭐`}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '4rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Rank</th>
              <th style={{ padding: '0.75rem 1rem' }}>Student</th>
              <th style={{ padding: '0.75rem 1rem' }}>College & Branch</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Rating</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Sessions</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>SkillCoins</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((student, idx) => (
              <tr key={student._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '1rem', fontWeight: '800', color: idx < 3 ? '#fbbf24' : 'var(--text-muted)' }}>
                  #{idx + 1}
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={student.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.name}`}
                      alt={student.name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <strong style={{ color: '#fff' }}>{student.name}</strong>
                  </div>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                  {student.college} • {student.branch}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#fbbf24' }}>
                  ⭐ {student.rating?.toFixed(1) || '5.0'}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#22d3ee' }}>
                  {student.completedSessions || 0}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '800', color: '#fbbf24' }}>
                  {student.skillCoins || 0} 🪙
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Badges Directory Showcase */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>Available Campus Badges</h2>
        <p>Unlock badges by teaching, learning, and gathering stellar student reviews.</p>
      </div>

      <div className="grid-3">
        {badgesList.map((badge, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              {badge.icon}
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '2px' }}>{badge.name}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
