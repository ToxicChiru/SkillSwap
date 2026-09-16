import React, { useState } from 'react';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { X, Star, MessageSquare } from 'lucide-react';

export const ReviewModal = ({ session, onClose, onSuccess }) => {
  const { showToast } = useNotification();

  const [knowledge, setKnowledge] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [punctuality, setPunctuality] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const overall = Math.round(((knowledge + communication + punctuality) / 3) * 10) / 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please write feedback about your learning experience.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/reviews', {
        sessionId: session._id,
        knowledge,
        communication,
        punctuality,
        comment
      });

      showToast('Review submitted! Reputation score updated.', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to submit review.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const StarPicker = ({ label, value, onChange }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{label}</span>
      <div style={{ display: 'flex', gap: '0.3rem' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              color: star <= value ? '#fbbf24' : '#475569',
              transition: 'transform 0.1s'
            }}
          >
            <Star size={20} fill={star <= value ? '#fbbf24' : 'transparent'} />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>Review Learning Session</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Topic: {session?.skill} • Overall: ⭐ {overall} / 5.0
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Criteria Ratings */}
          <div style={{
            background: 'var(--surface-secondary)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            marginBottom: '1.25rem'
          }}>
            <StarPicker label="Subject Knowledge & Clarity" value={knowledge} onChange={setKnowledge} />
            <StarPicker label="Communication & Patience" value={communication} onChange={setCommunication} />
            <StarPicker label="Punctuality & Reliability" value={punctuality} onChange={setPunctuality} />
          </div>

          {/* Written Review */}
          <div className="form-group">
            <label className="form-label">Written Feedback:</label>
            <textarea
              className="form-control"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="e.g., Explained complex concepts with clear practical examples and patience..."
              rows={3}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Submitting...' : 'Submit Verified Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
