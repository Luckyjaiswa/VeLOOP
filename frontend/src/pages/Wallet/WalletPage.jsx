import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Coins, 
  Gift, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter, 
  Sparkles, 
  PlusCircle, 
  X,
  History
} from 'lucide-react';
import { getWallet, redeemGiftCard } from '../../services/streakApi';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';
import StreakLoader from '../../components/StreakLoader';
import VoucherCard from '../../components/VoucherCard';
import RewardsStore from '../../components/RewardsStore';

const WalletPage = () => {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState(null);
  const [voucherFilter, setVoucherFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'REDEEMED'
  const [showStoreModal, setShowStoreModal] = useState(false);

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

  const handleRedeemVoucher = async (voucherId) => {
    try {
      setRedeemingId(voucherId);
      const res = await redeemGiftCard(voucherId);
      showToast(res.message || 'Gift card marked as redeemed!', 'success');
      await loadWallet();
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
    vouchers = amazonGiftCards,
    transactions = [],
  } = walletData || {};

  const allVouchers = vouchers || [];
  const activeVouchers = allVouchers.filter((v) => !v.isRedeemed);
  const redeemedVouchers = allVouchers.filter((v) => v.isRedeemed);

  const displayedVouchers =
    voucherFilter === 'ACTIVE'
      ? activeVouchers
      : voucherFilter === 'REDEEMED'
      ? redeemedVouchers
      : allVouchers;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem 5rem 1rem' }}>
      {/* Title & Store CTA */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            My VELoop <span style={{ color: '#FBBF24' }}>Wallet</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            Manage earned VE Coins, digital gift vouchers, and check full transaction audit trail
          </p>
        </div>

        {/* Redeem in Store Button */}
        <button
          onClick={() => setShowStoreModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: 'var(--gold-glow)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <ShoppingBag size={18} />
          <span>Redeem VEs in Store</span>
        </button>
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
                VE Coins Balance
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
              Ready to Spend
            </span>
          </div>

          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1 }}>
            {veBalance} <span style={{ fontSize: '1.3rem', color: '#A78BFA' }}>VEs</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.4rem' }}>
            Lifetime Earned: <strong style={{ color: '#DDD6FE' }}>{totalVeEarned} VEs</strong>
          </div>
        </div>

        {/* Gift Cards / Vouchers Balance Card */}
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
                Gift Voucher Portfolio
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
              {activeVouchers.length} Active / {allVouchers.length} Total
            </span>
          </div>

          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FBBF24', lineHeight: 1.1 }}>
            ₹{totalAmazonEarned}{' '}
            <span style={{ fontSize: '1rem', color: '#FDE68A', fontWeight: 600 }}>INR Value</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.4rem' }}>
            Instant digital redemption codes with 16-character security
          </div>
        </div>
      </div>

      {/* Voucher Inventory Section with Filters & Masking */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Digital Vouchers Inventory ({allVouchers.length})
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.25rem 0 0 0' }}>
              Codes are masked by default for privacy. Click the eye icon to reveal, or copy directly.
            </p>
          </div>

          {/* Filter Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(13, 7, 33, 0.9)',
              padding: '0.3rem',
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setVoucherFilter('ALL')}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: voucherFilter === 'ALL' ? '#8B5CF6' : 'transparent',
                color: voucherFilter === 'ALL' ? '#FFFFFF' : '#94A3B8',
                transition: 'all 0.2s ease',
              }}
            >
              All ({allVouchers.length})
            </button>
            <button
              onClick={() => setVoucherFilter('ACTIVE')}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: voucherFilter === 'ACTIVE' ? '#10B981' : 'transparent',
                color: voucherFilter === 'ACTIVE' ? '#FFFFFF' : '#94A3B8',
                transition: 'all 0.2s ease',
              }}
            >
              Active ({activeVouchers.length})
            </button>
            <button
              onClick={() => setVoucherFilter('REDEEMED')}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: voucherFilter === 'REDEEMED' ? '#64748B' : 'transparent',
                color: voucherFilter === 'REDEEMED' ? '#FFFFFF' : '#94A3B8',
                transition: 'all 0.2s ease',
              }}
            >
              Redeemed ({redeemedVouchers.length})
            </button>
          </div>
        </div>

        {displayedVouchers.length === 0 ? (
          <div
            className="glass-panel"
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              color: '#94A3B8',
              borderRadius: '20px',
            }}
          >
            <Gift size={44} color="#64748B" style={{ marginBottom: '0.75rem' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#E2E8F0' }}>
              {voucherFilter === 'ACTIVE'
                ? 'No Active Vouchers Right Now'
                : voucherFilter === 'REDEEMED'
                ? 'No Redeemed Vouchers'
                : 'No Digital Vouchers Claimed Yet'}
            </div>
            <p style={{ fontSize: '0.88rem', maxWidth: '440px', margin: '0.4rem auto 1.25rem auto' }}>
              Build daily streaks or redeem your earned VE Coins in the Rewards Store to collect Amazon, Google Play, and Flipkart vouchers!
            </p>
            <button
              onClick={() => setShowStoreModal(true)}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid #F59E0B',
                color: '#FDE68A',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              Explore Rewards Store
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.35rem',
            }}
          >
            {displayedVouchers.map((voucher) => (
              <VoucherCard
                key={voucher._id || voucher.code}
                voucher={voucher}
                onRedeem={handleRedeemVoucher}
                isRedeeming={redeemingId === (voucher._id || voucher.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Transaction Audit Trail Section */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem' }}>
          Wallet Transactions ({transactions.length})
        </h2>

        {transactions.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8' }}>
            No wallet transactions recorded yet.
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
                  <tr
                    style={{
                      background: 'rgba(13, 7, 33, 0.75)',
                      borderBottom: '1px solid var(--border-subtle)',
                      color: '#94A3B8',
                    }}
                  >
                    <th style={{ padding: '1rem' }}>Type</th>
                    <th style={{ padding: '1rem' }}>Description</th>
                    <th style={{ padding: '1rem' }}>Amount</th>
                    <th style={{ padding: '1rem' }}>Balance After</th>
                    <th style={{ padding: '1rem' }}>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const isCredit = tx.type === 'CREDIT';
                    return (
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
                                background: isCredit ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                color: isCredit ? '#34D399' : '#F87171',
                              }}
                            >
                              {isCredit ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                            </span>
                            <span
                              style={{
                                fontWeight: 700,
                                color: isCredit ? '#34D399' : '#F87171',
                              }}
                            >
                              {tx.type}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', color: '#E2E8F0', fontWeight: 600 }}>{tx.description}</td>
                        <td
                          style={{
                            padding: '1rem',
                            fontWeight: 700,
                            color: isCredit ? '#34D399' : '#F87171',
                          }}
                        >
                          {isCredit ? `+${tx.amount}` : `-${tx.amount}`} {tx.currency}
                        </td>
                        <td style={{ padding: '1rem', color: '#C4B5FD', fontFamily: 'var(--font-mono)' }}>
                          {tx.balanceAfter} VEs
                        </td>
                        <td style={{ padding: '1rem', color: '#94A3B8' }}>{formatDate(tx.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Rewards Store Modal */}
      {showStoreModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(7, 4, 18, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowStoreModal(false)}
        >
          <div
            style={{
              background: '#0D0721',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              borderRadius: '24px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: 'var(--primary-glow-lg)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Rewards Store <span style={{ color: '#FBBF24' }}>Catalog</span>
                </h2>
                <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: '0.2rem 0 0 0' }}>
                  Redeem your VE Virtual Coins instantly for verified digital vouchers
                </p>
              </div>
              <button
                onClick={() => setShowStoreModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  color: '#94A3B8',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <RewardsStore
              onRedeemSuccess={() => {
                loadWallet();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
