import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { X, ArrowLeftRight, Send } from 'lucide-react';

export const SwapModal = ({ partner, defaultRequestedSkill, defaultOfferedSkill, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [skillOffered, setSkillOffered] = useState('');
  const [skillRequested, setSkillRequested] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Set smart defaults
    if (defaultOfferedSkill) {
      setSkillOffered(defaultOfferedSkill);
    } else if (user?.teachingSkills?.length > 0) {
      setSkillOffered(user.teachingSkills[0].name);
    }

    if (defaultRequestedSkill) {
      setSkillRequested(defaultRequestedSkill);
    } else if (partner?.teachingSkills?.length > 0) {
      setSkillRequested(partner.teachingSkills[0].name);
    }
  }, [partner, user, defaultOfferedSkill, defaultRequestedSkill]);

  useEffect(() => {
    if (skillOffered && skillRequested) {
      setMessage(`Hi ${partner?.name?.split(' ')[0] || ''}! I'd love to teach you ${skillOffered} in exchange for learning ${skillRequested}. Let's swap skills!`);
    }
  }, [skillOffered, skillRequested, partner]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skillOffered || !skillRequested) {
      showToast('Please select both skills for the exchange proposal.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/swaps', {
        receiverId: partner._id,
        skillOffered,
        skillRequested,
        message
      });

      showToast(`SkillSwap proposal sent to ${partner.name}!`, 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to send swap request.', 'error');
    } finally {
      setSubmitting(false);
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
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <ArrowLeftRight size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>Propose SkillSwap</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>with {partner?.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Skill You Will Offer */}
          <div className="form-group">
            <label className="form-label">Skill You Will Offer (Teach):</label>
            <select
              className="form-control"
              value={skillOffered}
              onChange={e => setSkillOffered(e.target.value)}
              required
            >
              <option value="">-- Choose from your teaching skills --</option>
              {user?.teachingSkills?.map((s, idx) => (
                <option key={idx} value={s.name}>
                  {s.name} ({s.level || 'Intermediate'})
                </option>
              ))}
            </select>
          </div>

          {/* Skill You Want to Learn */}
          <div className="form-group">
            <label className="form-label">Skill You Want To Learn from {partner?.name}:</label>
            <select
              className="form-control"
              value={skillRequested}
              onChange={e => setSkillRequested(e.target.value)}
              required
            >
              <option value="">-- Choose what they teach --</option>
              {partner?.teachingSkills?.map((s, idx) => (
                <option key={idx} value={s.name}>
                  {s.name} ({s.level || 'Intermediate'})
                </option>
              ))}
            </select>
          </div>

          {/* Proposal Message */}
          <div className="form-group">
            <label className="form-label">Personal Note / Introduction:</label>
            <textarea
              className="form-control"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Explain what you want to achieve in this exchange..."
              rows={3}
              required
            />
          </div>

          {/* SkillCoin Summary Note */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            fontSize: '0.8rem',
            color: '#fcd34d',
            marginBottom: '1.25rem'
          }}>
            💡 <strong>SkillCoin Balance:</strong> Sessions are scheduled 1:1. 1 hour of teaching awards you +10 coins, and 1 hour of learning costs -10 coins.
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              <Send size={16} /> {submitting ? 'Sending...' : 'Send Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
