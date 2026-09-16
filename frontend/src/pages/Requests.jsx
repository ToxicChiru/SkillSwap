import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { RequestCard } from '../components/RequestCard';
import { ScheduleModal } from '../components/ScheduleModal';
import { ArrowLeftRight, Inbox, Send, Filter } from 'lucide-react';

export const Requests = () => {
  const { showToast } = useNotification();

  const [tab, setTab] = useState('incoming'); // 'incoming' or 'outgoing'
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Schedule modal state
  const [scheduleTarget, setScheduleTarget] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await api.get('/swaps');
      setIncoming(data.incoming || []);
      setOutgoing(data.outgoing || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRespond = async (swapId, action) => {
    try {
      await api.put(`/swaps/${swapId}/respond`, { action });
      showToast(`Swap request ${action.toLowerCase()}ed!`, 'success');
      fetchRequests();
    } catch (err) {
      showToast(err.message || 'Failed to respond to request.', 'error');
    }
  };

  const handleCancel = async (swapId) => {
    try {
      await api.delete(`/swaps/${swapId}`);
      showToast('Swap request cancelled.', 'info');
      fetchRequests();
    } catch (err) {
      showToast(err.message || 'Failed to cancel request.', 'error');
    }
  };

  const currentList = tab === 'incoming' ? incoming : outgoing;
  const filteredList = statusFilter === 'All' 
    ? currentList 
    : currentList.filter(r => r.status === statusFilter);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.35rem' }}>Swap Requests</h1>
          <p>Manage incoming exchange proposals from peers and track your sent requests.</p>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {['All', 'Pending', 'Accepted', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '9999px', fontSize: '0.8rem' }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        borderBottom: '1px solid var(--border-glass)',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => setTab('incoming')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: tab === 'incoming' ? '3px solid var(--accent-primary)' : '3px solid transparent',
            padding: '0.75rem 1.5rem',
            color: tab === 'incoming' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
        >
          <Inbox size={18} /> Incoming Proposals ({incoming.filter(r => r.status === 'Pending').length})
        </button>

        <button
          onClick={() => setTab('outgoing')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: tab === 'outgoing' ? '3px solid var(--accent-primary)' : '3px solid transparent',
            padding: '0.75rem 1.5rem',
            color: tab === 'outgoing' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
        >
          <Send size={18} /> Sent Proposals ({outgoing.length})
        </button>
      </div>

      {/* List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            Loading requests...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center' }}>
            <ArrowLeftRight size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h3>No {tab} proposals found</h3>
            <p style={{ maxWidth: '400px', margin: '0.5rem auto 0' }}>
              {tab === 'incoming' 
                ? "You don't have any incoming skill exchange proposals right now." 
                : "You haven't sent any proposals yet. Check Matches to find campus peers!"}
            </p>
          </div>
        ) : (
          filteredList.map(req => (
            <RequestCard
              key={req._id}
              request={req}
              type={tab}
              onRespond={handleRespond}
              onCancel={handleCancel}
              onSchedule={(partner, skill, swapId) => {
                setScheduleTarget({ partner, skill, swapId });
              }}
            />
          ))
        )}
      </div>

      {/* Schedule Modal */}
      {scheduleTarget && (
        <ScheduleModal
          partnerId={scheduleTarget.partner._id}
          partnerName={scheduleTarget.partner.name}
          defaultSkill={scheduleTarget.skill}
          swapRequestId={scheduleTarget.swapId}
          onClose={() => setScheduleTarget(null)}
          onSuccess={fetchRequests}
        />
      )}
    </div>
  );
};
