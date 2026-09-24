import React, { useState, useEffect } from 'react';
import { History, Award, CheckCircle2, ChevronLeft, ChevronRight, Gift, Coins } from 'lucide-react';
import { getStreakHistory } from '../../services/streakApi';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import StreakLoader from '../../components/StreakLoader';

const HistoryPage = () => {
  const [claims, setClaims] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadHistory = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await getStreakHistory(pageNum, 10);
      if (res.success) {
        setClaims(res.data);
        setPage(res.page);
        setTotalPages(res.pages);
        setTotalCount(res.total);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load streak claim history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory(page);
  }, [page]);

  if (loading && claims.length === 0) {
    return <StreakLoader message="Loading streak reward history..." />;
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem 4rem 1rem' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Reward Claim History
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            Complete audit trail of all your daily streak rewards and check-ins
          </p>
        </div>

        <div
          style={{
            padding: '0.45rem 0.95rem',
            borderRadius: '20px',
            background: 'rgba(124, 58, 237, 0.2)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            color: '#DDD6FE',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          Total Claims: <strong style={{ color: '#FBBF24' }}>{totalCount}</strong>
        </div>
      </div>

      {claims.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
          <History size={48} color="#64748B" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem', fontWeight: 700 }}>No Claims Recorded Yet</h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '400px', margin: '0.5rem auto 0 auto' }}>
            Head over to the Daily Streak Dashboard to claim Day 1 of your streak cycle!
          </p>
        </div>
      ) : (
        <div
          className="glass-panel"
          style={{
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(13, 7, 33, 0.75)', borderBottom: '1px solid var(--border-subtle)', color: '#94A3B8' }}>
                  <th style={{ padding: '1rem' }}>Cycle & Day</th>
                  <th style={{ padding: '1rem' }}>Reward Title</th>
                  <th style={{ padding: '1rem' }}>Reward Value</th>
                  <th style={{ padding: '1rem' }}>Voucher / Code</th>
                  <th style={{ padding: '1rem' }}>Sponsor Status</th>
                  <th style={{ padding: '1rem' }}>Claimed At</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr
                    key={claim._id}
                    style={{
                      borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            padding: '0.2rem 0.55rem',
                            borderRadius: '8px',
                            background: 'rgba(139, 92, 246, 0.2)',
                            color: '#DDD6FE',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                          }}
                        >
                          C#{claim.cycleNumber}
                        </span>
                        <span style={{ fontWeight: 600, color: '#FFFFFF' }}>Day {claim.dayNumber}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#E2E8F0', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {claim.rewardSnapshot?.rewardType === 'AMAZON_GIFT_CARD' ? (
                          <Gift size={16} color="#FBBF24" />
                        ) : (
                          <Coins size={16} color="#A78BFA" />
                        )}
                        <span>{claim.rewardSnapshot?.title || `Day ${claim.dayNumber} Reward`}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#FBBF24' }}>
                      {claim.rewardSnapshot?.rewardType === 'AMAZON_GIFT_CARD' ? `₹${claim.rewardSnapshot.value}` : `+${claim.rewardSnapshot.value} VEs`}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {claim.giftCardCode ? (
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem',
                            background: 'rgba(245, 158, 11, 0.15)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            color: '#FBBF24',
                            border: '1px dashed rgba(245, 158, 11, 0.4)',
                          }}
                        >
                          {claim.giftCardCode}
                        </span>
                      ) : (
                        <span style={{ color: '#64748B' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '8px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#34D399',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        <CheckCircle2 size={12} />
                        <span>{claim.cpaStatus || 'VERIFIED'}</span>
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#94A3B8' }}>{formatDate(claim.claimedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                background: 'rgba(13, 7, 33, 0.5)',
              }}
            >
              <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                Page {page} of {totalPages}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: page <= 1 ? '#64748B' : '#FFFFFF',
                    cursor: page <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: page >= totalPages ? '#64748B' : '#FFFFFF',
                    cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.85rem',
                  }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
