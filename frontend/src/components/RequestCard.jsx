import React from 'react';
import { ArrowLeftRight, Check, X, Calendar, Clock } from 'lucide-react';

export const RequestCard = ({ request, type, onRespond, onSchedule, onCancel }) => {
  const isIncoming = type === 'incoming';
  const partner = isIncoming ? request.sender : request.receiver;

  const statusBadge = 
    request.status === 'Accepted' ? 'badge-emerald' :
    request.status === 'Rejected' ? 'badge-rose' :
    request.status === 'Cancelled' ? 'badge-rose' : 'badge-amber';

  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src={partner?.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${partner?.name || 'student'}`}
            alt={partner?.name}
            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--text)' }}>{partner?.name}</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {partner?.college} • {partner?.branch}
            </span>
          </div>
        </div>
        <span className={`badge ${statusBadge}`}>
          {request.status}
        </span>
      </div>

      {/* Exchange details pill */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--surface-secondary)',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)',
        marginBottom: '0.85rem',
        fontSize: '0.875rem'
      }}>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
            {isIncoming ? 'They Teach:' : 'You Teach:'}
          </span>
          <strong style={{ color: 'var(--accent-cyan)' }}>{request.skillOffered}</strong>
        </div>

        <ArrowLeftRight size={16} color="var(--text-muted)" />

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
            {isIncoming ? 'They Learn:' : 'You Learn:'}
          </span>
          <strong style={{ color: 'var(--accent-indigo)' }}>{request.skillRequested}</strong>
        </div>
      </div>

      {/* Message */}
      {request.message && (
        <p style={{
          fontSize: '0.825rem',
          color: 'var(--text-secondary)',
          background: 'var(--surface-secondary)',
          border: '1px solid var(--border)',
          padding: '0.65rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1rem',
          fontStyle: 'italic'
        }}>
          "{request.message}"
        </p>
      )}

      {/* Action triggers */}
      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        {isIncoming && request.status === 'Pending' && (
          <>
            <button
              onClick={() => onRespond(request._id, 'Reject')}
              className="btn btn-danger btn-sm"
            >
              <X size={14} /> Decline
            </button>
            <button
              onClick={() => onRespond(request._id, 'Accept')}
              className="btn btn-success btn-sm"
            >
              <Check size={14} /> Accept Proposal
            </button>
          </>
        )}

        {request.status === 'Accepted' && (
          <button
            onClick={() => onSchedule(partner, request.skillRequested, request._id)}
            className="btn btn-primary btn-sm"
          >
            <Calendar size={14} /> Schedule 1:1 Session
          </button>
        )}

        {!isIncoming && request.status === 'Pending' && (
          <button
            onClick={() => onCancel(request._id)}
            className="btn btn-danger btn-sm"
          >
            Cancel Request
          </button>
        )}
      </div>
    </div>
  );
};
