import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { 
  Star, 
  MapPin, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Clock, 
  Coins, 
  Edit3, 
  Save, 
  Plus, 
  Trash2 
} from 'lucide-react';

export const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, refreshUser } = useAuth();
  const { showToast } = useNotification();

  const profileId = id || currentUser?._id;
  const isOwnProfile = currentUser?._id === profileId;

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [newTeach, setNewTeach] = useState({ name: '', category: 'Programming', level: 'Intermediate' });
  const [newLearn, setNewLearn] = useState({ name: '', category: 'Design', priority: 'High' });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/users/${profileId}`);
      setProfile(data.user);
      setReviews(data.reviews || []);
      setEditBio(data.user.bio || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileId) fetchProfile();
  }, [profileId]);

  const handleSaveBio = async () => {
    try {
      await api.put('/users/profile', { bio: editBio });
      showToast('Bio updated successfully!', 'success');
      setEditing(false);
      fetchProfile();
      refreshUser();
    } catch (err) {
      showToast(err.message || 'Failed to update bio.', 'error');
    }
  };

  const handleAddTeachSkill = async () => {
    if (!newTeach.name.trim()) return;
    const updated = [...(profile.teachingSkills || []), newTeach];
    try {
      await api.put('/users/skills', { teachingSkills: updated });
      showToast('Teaching skill added!', 'success');
      setNewTeach({ name: '', category: 'Programming', level: 'Intermediate' });
      fetchProfile();
      refreshUser();
    } catch (err) {
      showToast(err.message || 'Failed to add skill.', 'error');
    }
  };

  const handleRemoveTeachSkill = async (idx) => {
    const updated = profile.teachingSkills.filter((_, i) => i !== idx);
    try {
      await api.put('/users/skills', { teachingSkills: updated });
      showToast('Teaching skill removed.', 'info');
      fetchProfile();
      refreshUser();
    } catch (err) {
      showToast(err.message || 'Failed to remove skill.', 'error');
    }
  };

  const handleAddLearnSkill = async () => {
    if (!newLearn.name.trim()) return;
    const updated = [...(profile.learningSkills || []), newLearn];
    try {
      await api.put('/users/skills', { learningSkills: updated });
      showToast('Skill added to wishlist!', 'success');
      setNewLearn({ name: '', category: 'Design', priority: 'High' });
      fetchProfile();
      refreshUser();
    } catch (err) {
      showToast(err.message || 'Failed to add wishlist item.', 'error');
    }
  };

  const handleRemoveLearnSkill = async (idx) => {
    const updated = profile.learningSkills.filter((_, i) => i !== idx);
    try {
      await api.put('/users/skills', { learningSkills: updated });
      showToast('Wishlist item removed.', 'info');
      fetchProfile();
      refreshUser();
    } catch (err) {
      showToast(err.message || 'Failed to remove wishlist item.', 'error');
    }
  };

  if (loading || !profile) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading student profile...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Profile Header Card */}
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2.5rem', position: 'relative' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <img
            src={profile.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.name}`}
            alt={profile.name}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '24px',
              border: '3px solid var(--accent-primary)',
              objectFit: 'cover'
            }}
          />

          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
              <h1 style={{ fontSize: '2.2rem' }}>{profile.name}</h1>
              {profile.isVerified && (
                <span className="badge badge-emerald">✓ Campus Verified</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
              <MapPin size={15} /> {profile.college} • {profile.branch} (Semester {profile.semester})
            </div>

            {/* Rating Breakdown Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
              <span style={{ color: '#fbbf24', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={16} fill="#fbbf24" /> {profile.rating?.toFixed(1) || '5.0'} ({profile.totalReviews || 0} reviews)
              </span>
              <span style={{ color: '#34d399' }}>
                🎓 {profile.teachingHours || 0} Teaching Hours
              </span>
              <span style={{ color: '#22d3ee' }}>
                📖 {profile.completedSessions || 0} Sessions
              </span>
              <span style={{ color: '#fbbf24' }}>
                🪙 {profile.skillCoins || 0} SkillCoins
              </span>
            </div>
          </div>

          {isOwnProfile && !editing && (
            <button onClick={() => setEditing(true)} className="btn btn-secondary btn-sm">
              <Edit3 size={14} /> Edit Bio
            </button>
          )}
        </div>

        {/* Bio */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-glass)' }}>
          {editing ? (
            <div>
              <textarea
                className="form-control"
                value={editBio}
                onChange={e => setEditBio(e.target.value)}
                rows={3}
              />
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button onClick={() => setEditing(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button onClick={handleSaveBio} className="btn btn-primary btn-sm"><Save size={14} /> Save</button>
              </div>
            </div>
          ) : (
            <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', maxWidth: '800px' }}>
              "{profile.bio || 'Passionate about sharing knowledge and learning new things on campus.'}"
            </p>
          )}
        </div>
      </div>

      {/* Badges Earned */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Earned Badges & Distinctions</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {profile.badges?.map((badge, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255,255,255,0.03)',
                padding: '0.5rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid var(--border-glass)'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{badge.icon}</span>
              <div>
                <strong style={{ fontSize: '0.85rem', display: 'block', color: '#fff' }}>{badge.name}</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{badge.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column: Teaching Skills vs Learning Wishlist */}
      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        {/* Teaching Skills */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ color: '#34d399', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            Skills I Can Teach (+10 Coins / hr)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Skills offered for 1:1 learning sessions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
            {profile.teachingSkills?.map((s, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.25)',
                padding: '0.75rem 1rem',
                borderRadius: '10px'
              }}>
                <div>
                  <strong style={{ color: '#fff' }}>{s.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{s.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-emerald">{s.level}</span>
                  {isOwnProfile && (
                    <button onClick={() => handleRemoveTeachSkill(idx)} style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isOwnProfile && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Add skill to teach..."
                value={newTeach.name}
                onChange={e => setNewTeach({ ...newTeach, name: e.target.value })}
              />
              <select
                className="form-control"
                style={{ width: '130px' }}
                value={newTeach.level}
                onChange={e => setNewTeach({ ...newTeach, level: e.target.value })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button onClick={handleAddTeachSkill} className="btn btn-secondary">
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Learning Wishlist */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ color: '#22d3ee', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            Skills I Want to Learn
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Our matching engine actively scans for peers offering these topics.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
            {profile.learningSkills?.map((s, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.25)',
                padding: '0.75rem 1rem',
                borderRadius: '10px'
              }}>
                <div>
                  <strong style={{ color: '#fff' }}>{s.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{s.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-cyan">{s.priority} Priority</span>
                  {isOwnProfile && (
                    <button onClick={() => handleRemoveLearnSkill(idx)} style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isOwnProfile && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Add skill to learn..."
                value={newLearn.name}
                onChange={e => setNewLearn({ ...newLearn, name: e.target.value })}
              />
              <button onClick={handleAddLearnSkill} className="btn btn-secondary">
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Verified Peer Reviews */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>
          Verified Peer Reviews ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
            No reviews yet. Complete your first session to receive reviews!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.map((rev, idx) => (
              <div key={idx} style={{
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={rev.reviewer?.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${rev.reviewer?.name || 'reviewer'}`}
                      alt={rev.reviewer?.name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <strong style={{ color: '#fff' }}>{rev.reviewer?.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                        {rev.reviewer?.college} • Topic: {rev.skill}
                      </span>
                    </div>
                  </div>
                  <div style={{ color: '#fbbf24', fontWeight: '700', fontSize: '0.95rem' }}>
                    ⭐ {rev.overallRating} / 5.0
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.5rem 0' }}>
                  "{rev.comment}"
                </p>

                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Knowledge: {rev.ratings?.knowledge}★</span>
                  <span>Communication: {rev.ratings?.communication}★</span>
                  <span>Punctuality: {rev.ratings?.punctuality}★</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
