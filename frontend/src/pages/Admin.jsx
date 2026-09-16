import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { 
  ShieldAlert, 
  Users, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Coins, 
  Plus, 
  Ban, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

export const Admin = () => {
  const { showToast } = useNotification();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // New skill form
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('Programming');
  const [skillDesc, setSkillDesc] = useState('');
  const [skillIcon, setSkillIcon] = useState('⚡');
  const [addingSkill, setAddingSkill] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, reportsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/reports')
      ]);

      setStats(statsRes.stats);
      setUsers(usersRes.users || []);
      setReports(reportsRes.reports || []);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to fetch admin data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleBan = async (userId, userName) => {
    try {
      const res = await api.put(`/admin/users/${userId}/ban`);
      showToast(res.message || 'User status updated.', 'info');
      fetchAdminData();
    } catch (err) {
      showToast(err.message || 'Action failed.', 'error');
    }
  };

  const handleToggleVerify = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/verify`);
      showToast(res.message || 'Verification status changed.', 'success');
      fetchAdminData();
    } catch (err) {
      showToast(err.message || 'Action failed.', 'error');
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    try {
      setAddingSkill(true);
      await api.post('/skills', {
        name: skillName,
        category: skillCategory,
        description: skillDesc,
        icon: skillIcon
      });

      showToast(`Skill '${skillName}' added to platform directory!`, 'success');
      setSkillName('');
      setSkillDesc('');
      fetchAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to add skill.', 'error');
    } finally {
      setAddingSkill(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
          <ShieldAlert size={28} color="#fb7185" />
          <h1 style={{ fontSize: '2.4rem' }}>Campus Admin Command Center</h1>
        </div>
        <p>Monitor platform statistics, moderate user behavior, and manage the campus skill directory.</p>
      </div>

      {/* Platform Statistics */}
      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Total Students
            </span>
            <Users size={20} color="#818cf8" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#818cf8', fontFamily: 'var(--font-heading)' }}>
            {stats?.totalUsers || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered college students</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Total Sessions
            </span>
            <Calendar size={20} color="#34d399" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#34d399', fontFamily: 'var(--font-heading)' }}>
            {stats?.totalSessions || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34d399' }}>{stats?.completedSessions || 0} completed successfully</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              SkillCoins in Circulation
            </span>
            <Coins size={20} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fbbf24', fontFamily: 'var(--font-heading)' }}>
            {stats?.totalCoinsInCirculation || 0} 🪙
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Virtual student credit volume</div>
        </div>
      </div>

      {/* Two Column Layout: User Management & Add Skill */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* User Moderation */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Campus Student Directory</h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.6rem' }}>Student</th>
                  <th style={{ padding: '0.6rem' }}>Role</th>
                  <th style={{ padding: '0.6rem' }}>Coins</th>
                  <th style={{ padding: '0.6rem' }}>Status</th>
                  <th style={{ padding: '0.6rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.75rem 0.6rem' }}>
                      <strong style={{ color: '#fff', display: 'block' }}>{u.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</span>
                    </td>
                    <td style={{ padding: '0.75rem 0.6rem' }}>
                      <span className={`badge ${u.role === 'admin' ? 'badge-rose' : 'badge-indigo'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.6rem', fontWeight: '700', color: '#fbbf24' }}>
                      {u.skillCoins}
                    </td>
                    <td style={{ padding: '0.75rem 0.6rem' }}>
                      {u.isBanned ? (
                        <span className="badge badge-rose">Suspended</span>
                      ) : (
                        <span className="badge badge-emerald">Active</span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 0.6rem', textAlign: 'right' }}>
                      {u.role !== 'admin' && (
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => handleToggleVerify(u._id)}
                            className="btn btn-secondary btn-sm"
                            title="Toggle campus verification badge"
                          >
                            <Check size={12} /> {u.isVerified ? 'Verified' : 'Verify'}
                          </button>
                          <button
                            onClick={() => handleToggleBan(u._id, u.name)}
                            className={`btn btn-sm ${u.isBanned ? 'btn-success' : 'btn-danger'}`}
                            title={u.isBanned ? 'Reinstate student' : 'Suspend student'}
                          >
                            <Ban size={12} /> {u.isBanned ? 'Unban' : 'Suspend'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Skill to Catalog */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Add Skill to Directory</h3>

          <form onSubmit={handleAddSkill}>
            <div className="form-group">
              <label className="form-label">Skill Name:</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Flutter, Kotlin, Spanish"
                value={skillName}
                onChange={e => setSkillName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category:</label>
              <select
                className="form-control"
                value={skillCategory}
                onChange={e => setSkillCategory(e.target.value)}
              >
                <option value="Programming">Programming</option>
                <option value="Web Development">Web Development</option>
                <option value="AI / ML">AI / ML</option>
                <option value="Database">Database</option>
                <option value="Design">Design</option>
                <option value="Academics">Academics</option>
                <option value="Languages">Languages</option>
                <option value="Music">Music</option>
                <option value="Photography">Photography</option>
                <option value="Video Editing">Video Editing</option>
                <option value="Communication">Communication</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Icon (Emoji):</label>
              <input
                type="text"
                className="form-control"
                value={skillIcon}
                onChange={e => setSkillIcon(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description:</label>
              <textarea
                className="form-control"
                placeholder="Short summary of the skill..."
                value={skillDesc}
                onChange={e => setSkillDesc(e.target.value)}
                rows={2}
              />
            </div>

            <button
              type="submit"
              disabled={addingSkill}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              <Plus size={16} /> {addingSkill ? 'Adding...' : 'Add Skill to Catalog'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
