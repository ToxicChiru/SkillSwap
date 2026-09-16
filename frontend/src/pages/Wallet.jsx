import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Send, 
  Clock, 
  Gift, 
  ShieldCheck, 
  Info, 
  X 
} from 'lucide-react';

export const Wallet = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useNotification();

  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  // Transfer modal
  const [showTransfer, setShowTransfer] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [transferAmount, setTransferAmount] = useState(10);
  const [transferReason, setTransferReason] = useState('');
  const [transferring, setTransferring] = useState(false);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const data = await api.get('/wallet');
      setWallet(data.wallet);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!recipientEmail || transferAmount <= 0) {
      showToast('Please provide a valid recipient and positive coin amount.', 'error');
      return;
    }

    try {
      setTransferring(true);
      // Find recipient by email
      const userRes = await api.get('/users', { search: recipientEmail });
      const targetUser = (userRes.users || []).find(u => u.email.toLowerCase() === recipientEmail.toLowerCase());

      if (!targetUser) {
        showToast('No student found with that email address.', 'error');
        return;
      }

      await api.post('/wallet/transfer', {
        recipientId: targetUser._id,
        amount: transferAmount,
        reason: transferReason || 'Peer SkillCoin transfer'
      });

      showToast(`Successfully transferred ${transferAmount} SkillCoins to ${targetUser.name}!`, 'success');
      setShowTransfer(false);
      setRecipientEmail('');
      setTransferAmount(10);
      setTransferReason('');
      await refreshUser();
      fetchWallet();
    } catch (err) {
      showToast(err.message || 'Transfer failed.', 'error');
    } finally {
      setTransferring(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '2.4rem' }}>SkillCoin Wallet</h1>
            <span className="badge badge-amber">Virtual Credit System</span>
          </div>
          <p>
            Zero real money required. Exchange your knowledge hours for SkillCoins and spend them on learning.
          </p>
        </div>

        <button
          onClick={() => setShowTransfer(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Send size={16} /> Transfer Coins to Peer
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        {/* Balance Card */}
        <div className="glass-panel" style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.05) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', fontWeight: '700', textTransform: 'uppercase' }}>
              Available Balance
            </span>
            <span style={{ fontSize: '1.75rem' }}>🪙</span>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--accent-amber)', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
            {wallet?.balance ?? 50}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Can be redeemed for ~{Math.floor((wallet?.balance ?? 50) / 10)} hours of 1:1 learning sessions.
          </p>
        </div>

        {/* Total Earned */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: '700', textTransform: 'uppercase' }}>
              Total Coins Earned
            </span>
            <ArrowDownLeft size={24} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--accent-emerald)', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
            +{wallet?.totalEarned || 0}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Earned from teaching peers and campus welcome bonuses.
          </p>
        </div>

        {/* Total Spent */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-rose)', fontWeight: '700', textTransform: 'uppercase' }}>
              Total Coins Spent
            </span>
            <ArrowUpRight size={24} color="var(--accent-rose)" />
          </div>
          <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--accent-rose)', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
            -{wallet?.totalSpent || 0}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Invested into learning from campus mentors.
          </p>
        </div>
      </div>

      {/* Rules Explainer */}
      <div className="glass-panel" style={{
        padding: '1.5rem 2rem',
        marginBottom: '2.5rem',
        background: 'var(--surface-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)'
      }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={18} color="var(--accent-cyan)" /> How SkillCoins Operate:
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', fontSize: '0.875rem' }}>
          <div>
            <strong style={{ color: 'var(--accent-emerald)', display: 'block', marginBottom: '0.25rem' }}>
              🎓 1 Hour of Teaching = +10 Coins
            </strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Whenever you complete a session teaching a peer, 10 SkillCoins are credited to your wallet.
            </p>
          </div>
          <div>
            <strong style={{ color: 'var(--accent-rose)', display: 'block', marginBottom: '0.25rem' }}>
              📖 1 Hour of Learning = -10 Coins
            </strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              10 SkillCoins are deducted and transferred to your teacher once marked complete.
            </p>
          </div>
          <div>
            <strong style={{ color: 'var(--accent-amber)', display: 'block', marginBottom: '0.25rem' }}>
              🎁 +50 Welcome Bonus
            </strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Every verified college student gets 50 coins immediately upon creating their account.
            </p>
          </div>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Transaction Ledger</h3>

        {wallet?.transactions?.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
            No transactions recorded yet.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Type</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Reason / Session</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Balance After</th>
                </tr>
              </thead>
              <tbody>
                {wallet?.transactions?.map((t, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${
                        t.type === 'Earned' ? 'badge-emerald' :
                        t.type === 'Spent' ? 'badge-rose' : 'badge-amber'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--text)' }}>
                      {t.reason}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{
                      padding: '1rem',
                      textAlign: 'right',
                      fontWeight: '700',
                      color: t.type === 'Spent' ? 'var(--accent-rose)' : 'var(--accent-emerald)'
                    }}>
                      {t.type === 'Spent' ? `-${t.amount}` : `+${t.amount}`} 🪙
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '700', color: 'var(--accent-amber)' }}>
                      {t.balanceAfter} 🪙
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transfer Modal */}
      {showTransfer && (
        <div className="modal-overlay" onClick={() => setShowTransfer(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Peer SkillCoin Transfer</h3>
              <button onClick={() => setShowTransfer(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleTransfer}>
              <div className="form-group">
                <label className="form-label">Recipient College Email:</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. ananya.design@college.edu"
                  value={recipientEmail}
                  onChange={e => setRecipientEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amount (Coins):</label>
                <input
                  type="number"
                  className="form-control"
                  min={1}
                  max={wallet?.balance || 50}
                  value={transferAmount}
                  onChange={e => setTransferAmount(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Transfer Note / Reason:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Extra thank-you tip for Python guidance"
                  value={transferReason}
                  onChange={e => setTransferReason(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowTransfer(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={transferring} className="btn btn-primary">
                  {transferring ? 'Transferring...' : 'Send Coins'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
