import React, { useState } from 'react';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { X, Calendar, Video, Clock } from 'lucide-react';

export const ScheduleModal = ({ partnerId, partnerName, defaultSkill, swapRequestId, onClose, onSuccess }) => {
  const { showToast } = useNotification();

  const [skill, setSkill] = useState(defaultSkill || '');
  const [role, setRole] = useState('teacher'); // 'teacher' or 'learner'
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('19:00');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/skillswap-' + Math.random().toString(36).substring(7));
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skill || !date || !startTime) {
      showToast('Please fill in all session details.', 'error');
      return;
    }

    try {
      setLoading(true);
      await api.post('/sessions', {
        partnerId,
        role,
        skill,
        date,
        startTime,
        endTime,
        meetingLink,
        notes,
        swapRequestId
      });

      showToast(`Session successfully scheduled with ${partnerName}!`, 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to schedule session.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Calendar size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>Schedule Learning Session</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>with {partnerName}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Role Choice */}
          <div className="form-group">
            <label className="form-label">Your Role in this Session:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                className={`btn ${role === 'teacher' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRole('teacher')}
              >
                🎓 I will Teach (+10 Coins)
              </button>
              <button
                type="button"
                className={`btn ${role === 'learner' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRole('learner')}
              >
                📖 I will Learn (-10 Coins)
              </button>
            </div>
          </div>

          {/* Skill */}
          <div className="form-group">
            <label className="form-label">Topic / Skill:</label>
            <input
              type="text"
              className="form-control"
              value={skill}
              onChange={e => setSkill(e.target.value)}
              placeholder="e.g., React Hooks, Figma Variants, Python OOP"
              required
            />
          </div>

          {/* Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Date:</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Start Time:</label>
              <input
                type="time"
                className="form-control"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Meeting Link */}
          <div className="form-group">
            <label className="form-label">Meeting URL (Google Meet / Zoom):</label>
            <input
              type="url"
              className="form-control"
              value={meetingLink}
              onChange={e => setMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/..."
              required
            />
          </div>

          {/* Session Notes */}
          <div className="form-group">
            <label className="form-label">Session Agenda / Target Goals:</label>
            <textarea
              className="form-control"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="What questions or topics do you plan to cover during this 1 hour session?"
              rows={2}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-success">
              {loading ? 'Confirming...' : 'Confirm Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
