import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { MatchCard } from '../components/MatchCard';
import { SwapModal } from '../components/SwapModal';
import { Sparkles, Info, SlidersHorizontal } from 'lucide-react';

export const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFormulaInfo, setShowFormulaInfo] = useState(false);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await api.get('/matches');
      setMatches(data.matches || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '2.4rem' }}>Smart Skill Matches</h1>
            <span className="badge badge-cyan">Algorithmic Engine</span>
          </div>
          <p style={{ maxWidth: '650px' }}>
            Ranked peer recommendations based on reciprocal skills, proficiency levels, availability schedules, and college overlap.
          </p>
        </div>

        <button
          onClick={() => setShowFormulaInfo(!showFormulaInfo)}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Info size={15} /> How Scoring Works
        </button>
      </div>

      {/* Algorithm Scoring Explanation Banner */}
      {showFormulaInfo && (
        <div className="glass-panel" style={{
          padding: '1.5rem',
          marginBottom: '2.5rem',
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(6, 182, 212, 0.3)'
        }}>
          <h3 style={{ fontSize: '1.15rem', color: '#22d3ee', marginBottom: '0.75rem' }}>
            🧠 Multi-Factor Skill Compatibility Formula:
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1rem',
            textAlign: 'center',
            fontSize: '0.825rem'
          }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px' }}>
              <div style={{ fontWeight: '800', color: '#818cf8', fontSize: '1.2rem' }}>50%</div>
              <div>Skill Overlap</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mutual reciprocal interest</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px' }}>
              <div style={{ fontWeight: '800', color: '#22d3ee', fontSize: '1.2rem' }}>20%</div>
              <div>Skill Level</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Expert / Advanced depth</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px' }}>
              <div style={{ fontWeight: '800', color: '#34d399', fontSize: '1.2rem' }}>15%</div>
              <div>Availability</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Matching weekly slots</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px' }}>
              <div style={{ fontWeight: '800', color: '#fbbf24', fontSize: '1.2rem' }}>10%</div>
              <div>College & Branch</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Campus familiarity</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px' }}>
              <div style={{ fontWeight: '800', color: '#f43f5e', fontSize: '1.2rem' }}>5%</div>
              <div>Peer Rating</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Verified student reviews</div>
            </div>
          </div>
        </div>
      )}

      {/* Matches Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            Calculating reciprocal compatibility scores...
          </div>
        ) : matches.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '3.5rem', textAlign: 'center' }}>
            <Sparkles size={40} color="#818cf8" style={{ marginBottom: '1rem' }} />
            <h3>No strong matches yet!</h3>
            <p style={{ maxWidth: '480px', margin: '0.5rem auto 1.5rem' }}>
              Add more skills to your teaching repertoire and wishlist on your profile to unlock higher matching scores.
            </p>
          </div>
        ) : (
          matches.map((match, idx) => (
            <MatchCard
              key={idx}
              match={match}
              onRequestSwap={(partner) => setSelectedMatch(partner)}
            />
          ))
        )}
      </div>

      {/* Swap Modal */}
      {selectedMatch && (
        <SwapModal
          partner={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onSuccess={fetchMatches}
        />
      )}
    </div>
  );
};
