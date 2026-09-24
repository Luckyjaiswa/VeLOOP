import React, { useState, useEffect } from 'react';
import { Wallet, Coins, Gift, Copy, Check, ArrowUpRight, ArrowDownLeft, ShieldCheck, ShoppingCart } from 'lucide-react';
import { getWallet, redeemGiftCard } from '../../services/streakApi';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';
import StreakLoader from '../../components/StreakLoader';

const WalletPage = () => {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const [redeemingId, setRedeemingId] = useState(null);
  const { showToast } = useToast();

  const loadWallet = async () => {
    try {
      setLoading(true);
      const res = await getWallet();
      if (res.success && res.data) {
        setWalletData(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load wallet information', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Voucher code ${code} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleRedeem = async (voucherId) => {
    try {
      setRedeemingId(voucherId);
      const res = await redeemGiftCard(voucherId);
      showToast(res.message || 'Gift card marked as redeemed!', 'success');
      loadWallet();
    } catch (err) {
      showToast(err.message || 'Failed to redeem voucher', 'error');
    } finally {
      setRedeemingId(null);
    }
  };

  if (loading && !walletData) {
    return <StreakLoader message="Loading your VELoop Wallet..." />;
  }

  const {
    veBalance = 0,
    totalVeEarned = 0,
    totalAmazonEarned = 0,
    amazonGiftCards = [],
    transactions = [],
  } = walletData || {};

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem 4rem 1rem' }}>
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
          My VELoop Wallet
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginTop: '0.3rem' }}>
          Manage your earned VEs, Amazon gift vouchers, and check your transaction history
        </p>
      </div>

      {/* Balance Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* VE Coins Balance Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(23, 14, 56, 0.95) 0%, rgba(35, 18, 80, 0.95) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            borderRadius: '20px',
            padding: '1.75rem',
            boxShadow: 'var(--primary-glow)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(139, 92, 246, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Coins size={22} color="#A78BFA" />
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#C4B5FD' }}>
                VE Virtual Currency
              </span>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#34D399',
                background: 'rgba(16, 185, 129, 0.15)',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
              }}
            >
              Active
            </span>
          </div>

          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1 }}>
            {veBalance} <span style={{ fontSize: '1.3rem', color: '#A78BFA' }}>VEs</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.4rem' }}>
            Lifetime Earned: <strong style={{ color: '#DDD6FE' }}>{totalVeEarned} VEs</strong>
          </div>
        </div>

        {/* Amazon Gift Cards Balance Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 20, 50, 0.95) 0%, rgba(45, 25, 10, 0.95) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.45)',
            borderRadius: '20px',
            padding: '1.75rem',
            boxShadow: 'var(--gold-glow)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(245, 158, 11, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Gift size={22} color="#FBBF24" />
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FDE68A' }}>
                Amazon Gift Cards
              </span>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#FBBF24',
                background: 'rgba(245, 158, 11, 0.15)',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
              }}
            >
              {amazonGiftCards.length} Vouchers
            </span>
          </div>

          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FBBF24', lineHeight: 1.1 }}>
            ₹{totalAmazonEarned}{' '}
            <span style={{ fontSize: '1rem', color: '#FDE68A', fontWeight: 600 }}>INR Total</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.4rem' }}>
            Redeemable directly to your Amazon Pay account
          </div>
        </div>
      </div>

      {/* Amazon Gift Cards Section */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem' }}>
          Claimed Amazon Vouchers ({amazonGiftCards.length})
        </h2>

        {amazonGiftCards.length === 0 ? (
          <div
            className="glass-panel"
            style={{
              padding: '2.5rem',
              textAlign: 'center',
              color: '#94A3B8',
            }}
          >
            <Gift size={40} color="#64748B" style={{ marginBottom: '0.75rem' }} />
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#E2E8F0' }}>
              No Amazon Vouchers Claimed Yet
            </div>
            <p style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>
              Reach Day 4, 5, or 7 of your daily streak to earn real Amazon Gift Card codes!
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {amazonGiftCards.map((voucher) => (
              <div
                key={voucher._id || voucher.code}
                style={{
                  background: 'rgba(23, 14, 56, 0.85)',
                  border: voucher.isRedeemed
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  opacity: voucher.isRedeemed ? 0.75 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FBBF24' }}>
                    ₹{voucher.amount} Gift Card
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '8px',
                      background: voucher.isRedeemed
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(16, 185, 129, 0.15)',
                      color: voucher.isRedeemed ? '#94A3B8' : '#34D399',
                    }}
                  >
                    {voucher.isRedeemed ? 'Redeemed' : 'Ready to Redeem'}
                  </span>
                </div>

                <div
                  style={{
                    background: 'rgba(13, 7, 33, 0.9)',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px dashed rgba(245, 158, 11, 0.4)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#FFFFFF', fontSize: '0.9rem' }}>
                    {voucher.code}
                  </span>
                  <button
                    onClick={() => handleCopy(voucher.code)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#FBBF24',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.75rem',
                    }}
                  >
                    {copiedCode === voucher.code ? <Check size={14} color="#34D399" /> : <Copy size={14} />}
                    <span>{copiedCode === voucher.code ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#94A3B8' }}>
                  <span>Claimed: {formatDate(voucher.claimedAt)}</span>
                  <span>PIN: {voucher.pin || '7829'}</span>
                </div>

                {!voucher.isRedeemed && (
                  <button
                    onClick={() => handleRedeem(voucher._id)}
                    disabled={redeemingId === voucher._id}
                    style={{
                      marginTop: '0.25rem',
                      padding: '0.45rem',
                      borderRadius: '8px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      color: '#FDE68A',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {redeemingId === voucher._id ? 'Updating...' : 'Mark as Redeemed'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction History Section */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem' }}>
          Wallet Transactions ({transactions.length})
        </h2>

        {transactions.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
            No wallet activity recorded yet.
          </div>
        ) : (
          <div
            className="glass-panel"
            style={{
              borderRadius: '18px',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(13, 7, 33, 0.7)', borderBottom: '1px solid var(--border-subtle)', color: '#94A3B8' }}>
                    <th style={{ padding: '1rem' }}>Type</th>
                    <th style={{ padding: '1rem' }}>Description</th>
                    <th style={{ padding: '1rem' }}>Amount</th>
                    <th style={{ padding: '1rem' }}>Balance After</th>
                    <th style={{ padding: '1rem' }}>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx._id}
                      style={{
                        borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              background: tx.type === 'CREDIT' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                              color: tx.type === 'CREDIT' ? '#34D399' : '#F87171',
                            }}
                          >
                            {tx.type === 'CREDIT' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                          </span>
                          <span style={{ fontWeight: 600, color: tx.type === 'CREDIT' ? '#34D399' : '#F87171' }}>
                            {tx.type}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: '#E2E8F0' }}>{tx.description}</td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#FBBF24' }}>
                        +{tx.amount} {tx.currency}
                      </td>
                      <td style={{ padding: '1rem', color: '#C4B5FD', fontFamily: 'var(--font-mono)' }}>
                        {tx.balanceAfter} VEs
                      </td>
                      <td style={{ padding: '1rem', color: '#94A3B8' }}>{formatDate(tx.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
