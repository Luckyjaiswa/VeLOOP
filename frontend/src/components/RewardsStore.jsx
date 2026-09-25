import React, { useState } from 'react';
import { ShoppingBag, Coins, Gift, Copy, Check, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { redeemStoreVoucher } from '../services/streakApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import confetti from 'canvas-confetti';

const VOUCHER_CATALOG = [
  {
    id: 'AMAZON_5',
    title: 'Amazon Pay ₹5 Voucher',
    brand: 'Amazon Pay',
    amount: 5,
    cost: 100,
    accentColor: '#F59E0B',
    bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(23, 14, 56, 0.95) 100%)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    badge: 'Popular',
    iconText: 'Amazon',
    description: 'Instant ₹5 Amazon Pay balance for shopping, mobile recharges, & bills.',
  },
  {
    id: 'GOOGLE_PLAY_10',
    title: 'Google Play ₹10 Code',
    brand: 'Google Play',
    amount: 10,
    cost: 200,
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(23, 14, 56, 0.95) 100%)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    badge: 'Gamers Choice',
    iconText: 'Play Store',
    description: '₹10 Play Store recharge code for in-game currency, passes, and paid apps.',
  },
  {
    id: 'FLIPKART_25',
    title: 'Flipkart ₹25 Voucher',
    brand: 'Flipkart',
    amount: 25,
    cost: 450,
    accentColor: '#3B82F6',
    bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(23, 14, 56, 0.95) 100%)',
    borderColor: 'rgba(59, 130, 246, 0.4)',
    badge: 'Premium Value',
    iconText: 'Flipkart',
    description: '₹25 Flipkart e-gift voucher valid on all fashion, electronics & groceries.',
  },
];

const RewardsStore = ({ onRedeemSuccess }) => {
  const { walletSummary, updateWalletSummary } = useAuth();
  const { showToast } = useToast();
  const [redeemingId, setRedeemingId] = useState(null);
  const [newlyClaimedVoucher, setNewlyClaimedVoucher] = useState(null);
  const [copied, setCopied] = useState(false);

  const veBalance = walletSummary?.veBalance || 0;

  const handleRedeem = async (item) => {
    if (veBalance < item.cost) {
      showToast(`You need ${item.cost} VEs to redeem this ${item.brand} voucher. Keep streaking!`, 'warning');
      return;
    }

    try {
      setRedeemingId(item.id);
      const res = await redeemStoreVoucher(item.id);

      if (res.success && res.data) {
        showToast(res.message || `Redeemed ${item.brand} ₹${item.amount} voucher!`, 'success');

        // Confetti celebration
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#FBBF24', '#8B5CF6', '#10B981', '#3B82F6'],
        });

        // Update local wallet balance
        if (typeof res.data.newBalance === 'number') {
          updateWalletSummary({ veBalance: res.data.newBalance });
        }

        // Show claimed voucher popover
        setNewlyClaimedVoucher(res.data.voucher);

        if (onRedeemSuccess) {
          onRedeemSuccess(res.data);
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to redeem voucher', 'error');
    } finally {
      setRedeemingId(null);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast(`Voucher code ${code} copied to clipboard!`, 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      style={{
        background: 'rgba(19, 11, 46, 0.75)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        borderRadius: '24px',
        padding: '2rem',
        marginTop: '2.5rem',
        marginBottom: '2rem',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Store Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
          borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
          paddingBottom: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <ShoppingBag size={20} />
            </div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Rewards Redemption Store
            </h2>
          </div>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginTop: '0.3rem', marginBottom: 0 }}>
            Exchange your daily streak VE Coins for real gift cards and digital recharge codes instantly!
          </p>
        </div>

        {/* Current Balance Badge */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.5)',
            borderRadius: '20px',
            padding: '0.6rem 1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.25)',
          }}
        >
          <Coins size={20} color="#FBBF24" />
          <span style={{ fontSize: '0.82rem', color: '#FDE68A', fontWeight: 600 }}>Your Balance:</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FBBF24' }}>
            {veBalance} <span style={{ fontSize: '0.8rem' }}>VEs</span>
          </span>
        </div>
      </div>

      {/* Newly Claimed Voucher Banner / Alert */}
      {newlyClaimedVoucher && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(23, 14, 56, 0.95) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#10B981',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Check size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>
                🎉 {newlyClaimedVoucher.brand} ₹{newlyClaimedVoucher.amount} Voucher Unlocked!
              </div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                Code: <strong style={{ color: '#FBBF24', letterSpacing: '0.05em' }}>{newlyClaimedVoucher.code}</strong> (PIN: {newlyClaimedVoucher.pin})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => handleCopyCode(newlyClaimedVoucher.code)}
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#FFFFFF',
                padding: '0.5rem 1rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={() => setNewlyClaimedVoucher(null)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                color: '#94A3B8',
                padding: '0.5rem 0.8rem',
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Vouchers Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {VOUCHER_CATALOG.map((item) => {
          const canAfford = veBalance >= item.cost;
          const isRedeeming = redeemingId === item.id;

          return (
            <div
              key={item.id}
              style={{
                background: item.bgGradient,
                border: `1px solid ${item.borderColor}`,
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: canAfford ? `0 8px 24px rgba(0, 0, 0, 0.4)` : 'none',
                opacity: canAfford ? 1 : 0.72,
              }}
            >
              {/* Card Top */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                  <span
                    style={{
                      background: `rgba(255, 255, 255, 0.08)`,
                      color: item.accentColor,
                      border: `1px solid ${item.borderColor}`,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '10px',
                    }}
                  >
                    {item.badge}
                  </span>

                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#FBBF24',
                      background: 'rgba(245, 158, 11, 0.15)',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Coins size={13} /> {item.cost} VEs
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.35rem', lineHeight: 1.4 }}>
                  {item.description}
                </p>
              </div>

              {/* Card Bottom / Action */}
              <div>
                <button
                  onClick={() => handleRedeem(item)}
                  disabled={!canAfford || isRedeeming}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '14px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: canAfford && !isRedeeming ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease',
                    background: isRedeeming
                      ? 'rgba(139, 92, 246, 0.5)'
                      : canAfford
                      ? `linear-gradient(135deg, ${item.accentColor} 0%, #7C3AED 100%)`
                      : 'rgba(51, 65, 85, 0.5)',
                    color: canAfford ? '#FFFFFF' : '#94A3B8',
                    boxShadow: canAfford ? `0 4px 15px rgba(0, 0, 0, 0.3)` : 'none',
                  }}
                >
                  {isRedeeming ? (
                    <span>Redeeming Code...</span>
                  ) : canAfford ? (
                    <>
                      <Sparkles size={16} />
                      <span>Redeem for {item.cost} VEs</span>
                    </>
                  ) : (
                    <>
                      <Coins size={14} />
                      <span>Need {item.cost - veBalance} More VEs</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RewardsStore;
