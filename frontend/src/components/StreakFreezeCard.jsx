import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Snowflake, Coins, Sparkles, Check } from 'lucide-react';
import { buyStreakFreeze } from '../services/streakApi';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

const StreakFreezeCard = ({ hasFreeze = false, onFreezePurchased }) => {
  const [loading, setLoading] = useState(false);
  const { walletSummary, updateWalletSummary } = useAuth();
  const { showToast } = useToast();

  const veBalance = walletSummary?.veBalance || 0;
  const canAfford = veBalance >= 50;

  const handleBuy = async () => {
    if (hasFreeze) {
      showToast('Streak Freeze Shield is already active for your streak!', 'info');
      return;
    }

    if (!canAfford) {
      showToast('Insufficient VE Coins! You need at least 50 VEs to purchase a Streak Freeze.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const res = await buyStreakFreeze();

      if (res.success) {
        showToast(res.message || 'Streak Freeze Shield activated!', 'success');

        // Confetti celebration
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#06B6D4', '#38BDF8', '#818CF8', '#FBBF24'],
        });

        // Update local wallet balance in navbar
        if (typeof res.veBalance === 'number') {
          updateWalletSummary({ veBalance: res.veBalance });
        }

        if (onFreezePurchased) {
          onFreezePurchased(res);
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to purchase Streak Freeze Shield', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: hasFreeze
          ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(23, 14, 56, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(23, 14, 56, 0.95) 0%, rgba(13, 7, 33, 0.95) 100%)',
        border: hasFreeze
          ? '1px solid rgba(56, 189, 248, 0.6)'
          : '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '20px',
        padding: '1.25rem 1.5rem',
        boxShadow: hasFreeze
          ? '0 0 25px rgba(6, 182, 212, 0.25)'
          : '0 8px 24px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        marginBottom: '1.5rem',
      }}
    >
      {/* Decorative Ice / Shield Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '120px',
          height: '120px',
          background: hasFreeze
            ? 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Left: Icon & Description */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: hasFreeze
                ? 'linear-gradient(135deg, #06B6D4 0%, #0284C7 100%)'
                : 'linear-gradient(135deg, #374151 0%, #1F2937 100%)',
              border: hasFreeze
                ? '1px solid #7DD3FC'
                : '1px solid rgba(148, 163, 184, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: hasFreeze ? '0 0 15px rgba(6, 182, 212, 0.5)' : 'none',
              flexShrink: 0,
            }}
          >
            {hasFreeze ? <ShieldCheck size={28} /> : <Snowflake size={28} color="#94A3B8" />}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}
              >
                Streak Freeze Shield
              </h3>
              {hasFreeze ? (
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10B981',
                    color: '#34D399',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Check size={11} /> ACTIVE
                </span>
              ) : (
                <span
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: '#FBBF24',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                  }}
                >
                  50 VEs
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: '0.82rem',
                color: '#94A3B8',
                marginTop: '0.2rem',
                marginBottom: 0,
                maxWidth: '520px',
              }}
            >
              {hasFreeze
                ? 'Your streak is fully protected! If you miss a 24-hour check-in window, the shield will absorb the loss so you stay on your streak ladder.'
                : 'Protect your streak from unexpected misses! Automatically prevents reset back to Day 1 if you miss a 24-hour check-in window.'}
            </p>
          </div>
        </div>

        {/* Right: Action Button & Price Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {!hasFreeze && (
            <div style={{ textAlign: 'right', display: 'none', sm: 'block' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Price</div>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#FBBF24',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Coins size={14} /> 50 VEs
              </div>
            </div>
          )}

          <button
            onClick={handleBuy}
            disabled={loading || hasFreeze || !canAfford}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '14px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: hasFreeze || !canAfford || loading ? 'not-allowed' : 'pointer',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: hasFreeze
                ? 'rgba(16, 185, 129, 0.2)'
                : canAfford
                ? 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)'
                : 'rgba(51, 65, 85, 0.5)',
              color: hasFreeze ? '#34D399' : canAfford ? '#FFFFFF' : '#94A3B8',
              boxShadow: !hasFreeze && canAfford ? '0 4px 15px rgba(6, 182, 212, 0.4)' : 'none',
            }}
          >
            {hasFreeze ? (
              <>
                <ShieldCheck size={16} />
                <span>Protected</span>
              </>
            ) : loading ? (
              <span>Activating...</span>
            ) : !canAfford ? (
              <>
                <Coins size={15} />
                <span>Need 50 VEs</span>
              </>
            ) : (
              <>
                <Snowflake size={16} />
                <span>Buy Freeze (50 VEs)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreakFreezeCard;
