import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { UserPlus, Plus, Trash2, Sparkles, Coins } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: 'National Institute of Technology',
    branch: 'Computer Science & Engineering',
    semester: 5,
    bio: ''
  });

  const [teachingSkills, setTeachingSkills] = useState([
    { name: 'Python', category: 'Programming', level: 'Intermediate', experience: '1 year' }
  ]);
  const [learningSkills, setLearningSkills] = useState([
    { name: 'UI/UX Design', category: 'Design', priority: 'High' }
  ]);

  const [newTeachSkill, setNewTeachSkill] = useState({ name: '', category: 'Programming', level: 'Intermediate' });
  const [newLearnSkill, setNewLearnSkill] = useState({ name: '', category: 'Design', priority: 'High' });
  const [loading, setLoading] = useState(false);

  const addTeachingSkill = () => {
    if (!newTeachSkill.name.trim()) return;
    setTeachingSkills([...teachingSkills, { ...newTeachSkill }]);
    setNewTeachSkill({ name: '', category: 'Programming', level: 'Intermediate' });
  };

  const removeTeachingSkill = (idx) => {
    setTeachingSkills(teachingSkills.filter((_, i) => i !== idx));
  };

  const addLearningSkill = () => {
    if (!newLearnSkill.name.trim()) return;
    setLearningSkills([...learningSkills, { ...newLearnSkill }]);
    setNewLearnSkill({ name: '', category: 'Design', priority: 'High' });
  };

  const removeLearningSkill = (idx) => {
    setLearningSkills(learningSkills.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (teachingSkills.length === 0) {
      showToast('Please add at least one skill you can teach to start exchanging.', 'error');
      return;
    }

    try {
      setLoading(true);
      await register({
        ...formData,
        teachingSkills,
        learningSkills
      });
      showToast('Registration successful! +50 SkillCoins added to your wallet 🪙', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            color: '#fbbf24',
            fontSize: '0.8rem',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            <Coins size={15} /> Welcome Gift: +50 SkillCoins on Signup!
          </div>
          <h2>Join the Campus Skill Network</h2>
          <p style={{ fontSize: '0.875rem' }}>Step {step} of 2: {step === 1 ? 'Personal & College Details' : 'Skills to Teach & Learn'}</p>
        </div>

        {step === 1 ? (
          <div>
            <div className="form-group">
              <label className="form-label">Full Name:</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Aditya Verma"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">College Email ID:</label>
              <input
                type="email"
                className="form-control"
                placeholder="e.g. aditya@college.edu"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">College / University:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. NIT Trichy"
                  value={formData.college}
                  onChange={e => setFormData({ ...formData, college: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Semester:</label>
                <input
                  type="number"
                  className="form-control"
                  min={1}
                  max={8}
                  value={formData.semester}
                  onChange={e => setFormData({ ...formData, semester: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Department / Branch:</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Computer Science & Engineering"
                value={formData.branch}
                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Short Bio:</label>
              <textarea
                className="form-control"
                placeholder="Tell other students what you are enthusiastic about..."
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                rows={2}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (!formData.name || !formData.email || !formData.password) {
                  showToast('Please fill in required fields.', 'error');
                  return;
                }
                setStep(2);
              }}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              Continue to Skills Setup →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Skills to Teach */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ color: '#34d399', fontSize: '1.05rem', marginBottom: '0.4rem' }}>
                1. Skills You Can Teach (+10 Coins / hr):
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Add subjects or practical tools you can explain clearly to a fellow student.
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Python, React, Video Editing"
                  value={newTeachSkill.name}
                  onChange={e => setNewTeachSkill({ ...newTeachSkill, name: e.target.value })}
                />
                <select
                  className="form-control"
                  style={{ width: '140px' }}
                  value={newTeachSkill.level}
                  onChange={e => setNewTeachSkill({ ...newTeachSkill, level: e.target.value })}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <button type="button" onClick={addTeachingSkill} className="btn btn-secondary">
                  <Plus size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {teachingSkills.map((s, idx) => (
                  <span key={idx} className="badge badge-emerald" style={{ padding: '0.4rem 0.8rem' }}>
                    {s.name} ({s.level})
                    <button
                      type="button"
                      onClick={() => removeTeachingSkill(idx)}
                      style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer', marginLeft: '4px' }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Skills to Learn */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ color: '#22d3ee', fontSize: '1.05rem', marginBottom: '0.4rem' }}>
                2. Skills You Want To Learn:
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Our algorithm will prioritize matching you with peers who teach these skills.
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Figma, Machine Learning, Guitar"
                  value={newLearnSkill.name}
                  onChange={e => setNewLearnSkill({ ...newLearnSkill, name: e.target.value })}
                />
                <button type="button" onClick={addLearningSkill} className="btn btn-secondary">
                  <Plus size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {learningSkills.map((s, idx) => (
                  <span key={idx} className="badge badge-cyan" style={{ padding: '0.4rem 0.8rem' }}>
                    {s.name}
                    <button
                      type="button"
                      onClick={() => removeLearningSkill(idx)}
                      style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer', marginLeft: '4px' }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex: 1 }}>
                ← Back
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
                <UserPlus size={16} /> {loading ? 'Creating Profile...' : 'Complete & Collect 50 Coins 🪙'}
              </button>
            </div>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
