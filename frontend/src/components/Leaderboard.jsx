import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Flame, 
  Coins, 
  Medal, 
  Crown, 
  RefreshCw, 
  Sparkles, 
  ArrowRight, 
  User, 
  TrendingUp,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { getLeaderboard } from '../services/streakApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Leaderboard = () => {
  const { user: authUser } = useAuth();
  const { showToast } = useToast();

  const [topUsers, setTopUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLeaderboardData = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const res = await getLeaderboard();
      if (res.success && res.data) {
        setTopUsers(res.data.topUsers || []);
        setCurrentUser(res.data.currentUser || null);
        setTotalUsers(res.data.totalUsers || 0);
        setLastUpdated(new Date());
        if (isManual) {
          showToast('Leaderboard refreshed with latest rankings!', 'info');
        }
      } else {
        throw new Error(res.message || 'Failed to fetch leaderboard');
      }
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      setError(err.message || 'Unable to load leaderboard data');
      showToast(err.message || 'Failed to load leaderboard', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  // Split top 3 for podium
  const rank1 = topUsers.find((u) => u.rank === 1);
  const rank2 = topUsers.find((u) => u.rank === 2);
  const rank3 = topUsers.find((u) => u.rank === 3);

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            color: '#FFFFFF',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.6)',
            fontWeight: 800,
          }}
          title="1st Place (Gold)"
        >
          <Crown size={20} color="#FFFFFF" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #CBD5E1 0%, #64748B 100%)',
            color: '#FFFFFF',
            boxShadow: '0 0 12px rgba(203, 213, 225, 0.4)',
            fontWeight: 800,
          }}
          title="2nd Place (Silver)"
        >
          <Medal size={20} color="#FFFFFF" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #D97706 0%, #78350F 100%)',
            color: '#FFFFFF',
            boxShadow: '0 0 12px rgba(217, 119, 6, 0.4)',
            fontWeight: 800,
          }}
          title="3rd Place (Bronze)"
        >
          <Medal size={20} color="#FFFFFF" />
        </div>
      );
    }
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#94A3B8',
          fontSize: '0.85rem',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
        }}
      >
        #{rank}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem 6rem 1rem' }}>
      {/* Header with Title & Refresh */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
              }}
            >
              <Trophy size={22} color="#FFFFFF" />
            </div>
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Global Streakers <span style={{ color: '#FBBF24' }}>Leaderboard</span>
            </h1>
          </div>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem', margin: 0 }}>
            Real-time rankings based on active consecutive streak days & earned VEs
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => fetchLeaderboardData(true)}
            disabled={refreshing || loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1rem',
              borderRadius: '12px',
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              color: '#DDD6FE',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <RefreshCw
              size={15}
              style={{
                animation: refreshing ? 'spin 1s linear infinite' : 'none',
              }}
            />
            <span>{refreshing ? 'Updating...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Quick Overview Stats Pill Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
      >
        <div
          style={{
            background: 'rgba(23, 14, 56, 0.7)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '16px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Flame size={22} color="#F59E0B" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
              Highest Active Streak
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FBBF24' }}>
              {rank1 ? `${rank1.activeStreak} Days` : '0 Days'}
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(23, 14, 56, 0.7)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '16px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp size={22} color="#34D399" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Competitors
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34D399' }}>
              {totalUsers} Streakers
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(23, 14, 56, 0.7)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '16px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(139, 92, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Crown size={22} color="#A78BFA" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
              Your Global Rank
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#DDD6FE' }}>
              {currentUser ? `#${currentUser.rank}` : 'Unranked'}
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards (Gold, Silver, Bronze Spotlight) */}
      {!loading && topUsers.length >= 3 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
            alignItems: 'flex-end',
            marginBottom: '3rem',
          }}
        >
          {/* Rank 2 (Silver) */}
          {rank2 && (
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(30, 25, 55, 0.95) 0%, rgba(15, 10, 32, 0.95) 100%)',
                border: '1px solid rgba(203, 213, 225, 0.45)',
                borderRadius: '20px',
                padding: '1.75rem 1.25rem',
                textAlign: 'center',
                boxShadow: '0 0 20px rgba(203, 213, 225, 0.15)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #CBD5E1 0%, #64748B 100%)',
                  padding: '0.25rem 0.85rem',
                  borderRadius: '12px',
                  color: '#0F172A',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Medal size={14} color="#0F172A" />
                <span>#2 SILVER</span>
              </div>

              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  margin: '0.5rem auto 0.75rem auto',
                  border: '3px solid #CBD5E1',
                  overflow: 'hidden',
                  background: '#1E1B4B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#CBD5E1',
                }}
              >
                {rank2.avatar ? (
                  <img src={rank2.avatar} alt={rank2.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  rank2.initials
                )}
              </div>

              <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', margin: '0 0 0.4rem 0', fontWeight: 700 }}>
                {rank2.name}
              </h3>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  color: '#FBBF24',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                }}
              >
                <Flame size={15} color="#F59E0B" />
                <span>{rank2.activeStreak} Day Streak</span>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                Total Earned: <strong style={{ color: '#E2E8F0' }}>{rank2.totalVeEarned} VEs</strong>
              </div>
            </div>
          )}

          {/* Rank 1 (Gold - Center elevated) */}
          {rank1 && (
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(45, 28, 15, 0.95) 0%, rgba(20, 12, 40, 0.95) 100%)',
                border: '2px solid rgba(245, 158, 11, 0.8)',
                borderRadius: '24px',
                padding: '2.25rem 1.5rem',
                textAlign: 'center',
                boxShadow: '0 0 35px rgba(245, 158, 11, 0.35)',
                position: 'relative',
                transform: 'translateY(-10px)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  padding: '0.35rem 1.1rem',
                  borderRadius: '14px',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.5)',
                }}
              >
                <Crown size={16} color="#FFFFFF" />
                <span>#1 CHAMPION</span>
              </div>

              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  margin: '0.5rem auto 0.75rem auto',
                  border: '4px solid #F59E0B',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)',
                  overflow: 'hidden',
                  background: '#2D1B00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#FBBF24',
                }}
              >
                {rank1.avatar ? (
                  <img src={rank1.avatar} alt={rank1.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  rank1.initials
                )}
              </div>

              <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', margin: '0 0 0.4rem 0', fontWeight: 800 }}>
                {rank1.name}
              </h3>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'rgba(245, 158, 11, 0.25)',
                  border: '1px solid #F59E0B',
                  padding: '0.35rem 0.95rem',
                  borderRadius: '20px',
                  color: '#FDE68A',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  marginBottom: '0.75rem',
                }}
              >
                <Flame size={18} color="#FBBF24" />
                <span>{rank1.activeStreak} Day Streak 🔥</span>
              </div>

              <div style={{ fontSize: '0.9rem', color: '#C4B5FD' }}>
                Wallet Balance: <strong style={{ color: '#FBBF24' }}>{rank1.walletVEs} VEs</strong> (Lifetime: {rank1.totalVeEarned})
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {rank3 && (
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(35, 20, 25, 0.95) 0%, rgba(15, 10, 32, 0.95) 100%)',
                border: '1px solid rgba(217, 119, 6, 0.5)',
                borderRadius: '20px',
                padding: '1.75rem 1.25rem',
                textAlign: 'center',
                boxShadow: '0 0 20px rgba(217, 119, 6, 0.15)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #D97706 0%, #78350F 100%)',
                  padding: '0.25rem 0.85rem',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Medal size={14} color="#FFFFFF" />
                <span>#3 BRONZE</span>
              </div>

              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  margin: '0.5rem auto 0.75rem auto',
                  border: '3px solid #D97706',
                  overflow: 'hidden',
                  background: '#30180B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#F59E0B',
                }}
              >
                {rank3.avatar ? (
                  <img src={rank3.avatar} alt={rank3.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  rank3.initials
                )}
              </div>

              <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', margin: '0 0 0.4rem 0', fontWeight: 700 }}>
                {rank3.name}
              </h3>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(217, 119, 6, 0.15)',
                  border: '1px solid rgba(217, 119, 6, 0.35)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  color: '#FDE68A',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                }}
              >
                <Flame size={15} color="#D97706" />
                <span>{rank3.activeStreak} Day Streak</span>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                Total Earned: <strong style={{ color: '#E2E8F0' }}>{rank3.totalVeEarned} VEs</strong>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Leaderboard Table */}
      <div
        className="glass-panel"
        style={{
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--primary-glow)',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(13, 7, 33, 0.85)',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Top 10 Global Standings
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
              Ranked dynamically by active streak days and circulating VE rewards
            </p>
          </div>
          {lastUpdated && (
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
              Updated {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: '#A78BFA' }}>
            <RefreshCw size={36} style={{ animation: 'spin 1.2s linear infinite', marginBottom: '1rem' }} />
            <div style={{ fontSize: '1.05rem', fontWeight: 600 }}>Calculating Global Rankings...</div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Syncing user streak cycles and verified wallets</p>
          </div>
        ) : error ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#EF4444' }}>
            <AlertCircle size={40} style={{ marginBottom: '0.75rem' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Failed to Load Leaderboard</div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.5rem 0 1rem 0' }}>{error}</p>
            <button
              onClick={() => fetchLeaderboardData(true)}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                color: '#F87171',
                padding: '0.5rem 1.2rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Retry Connection
            </button>
          </div>
        ) : topUsers.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
            <Trophy size={42} color="#64748B" style={{ marginBottom: '0.75rem' }} />
            <div style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 600 }}>No Leaderboard Data Yet</div>
            <p style={{ fontSize: '0.85rem' }}>Be the first user to build a streak and claim the #1 spot!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr
                  style={{
                    background: 'rgba(13, 7, 33, 0.95)',
                    borderBottom: '1px solid var(--border-subtle)',
                    color: '#94A3B8',
                    fontSize: '0.82rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  <th style={{ padding: '1rem 1.25rem', width: '90px' }}>Rank</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Streaker</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Active Streak</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Total VEs Earned</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Wallet Balance</th>
                </tr>
              </thead>
              <tbody>
                {topUsers.map((item) => {
                  const isCurrent = item.isCurrentUser;
                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
                        background: isCurrent
                          ? 'rgba(139, 92, 246, 0.15)'
                          : 'transparent',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isCurrent) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isCurrent) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      {/* Rank Column */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        {getRankBadge(item.rank)}
                      </td>

                      {/* User Column */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              background: '#1E1B4B',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.9rem',
                              fontWeight: 700,
                              color: '#A78BFA',
                              border: isCurrent
                                ? '2px solid #A78BFA'
                                : '1px solid rgba(255, 255, 255, 0.15)',
                              flexShrink: 0,
                            }}
                          >
                            {item.avatar ? (
                              <img
                                src={item.avatar}
                                alt={item.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              item.initials
                            )}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>
                                {item.name}
                              </span>
                              {isCurrent && (
                                <span
                                  style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '8px',
                                    background: 'rgba(139, 92, 246, 0.35)',
                                    color: '#DDD6FE',
                                    border: '1px solid #8B5CF6',
                                  }}
                                >
                                  YOU
                                </span>
                              )}
                              {item.role === 'admin' && (
                                <span
                                  style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    padding: '0.1rem 0.4rem',
                                    borderRadius: '6px',
                                    background: 'rgba(245, 158, 11, 0.2)',
                                    color: '#FDE68A',
                                  }}
                                >
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                              Joined {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Active Streak Column */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: '0.3rem 0.75rem',
                            borderRadius: '16px',
                            background:
                              item.activeStreak > 0
                                ? 'rgba(245, 158, 11, 0.15)'
                                : 'rgba(255, 255, 255, 0.05)',
                            border:
                              item.activeStreak > 0
                                ? '1px solid rgba(245, 158, 11, 0.4)'
                                : '1px solid rgba(255, 255, 255, 0.1)',
                            color: item.activeStreak > 0 ? '#FBBF24' : '#94A3B8',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                          }}
                        >
                          <Flame
                            size={16}
                            color={item.activeStreak > 0 ? '#F59E0B' : '#64748B'}
                          />
                          <span>{item.activeStreak} {item.activeStreak === 1 ? 'Day' : 'Days'}</span>
                        </div>
                      </td>

                      {/* Total VEs Earned Column */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Coins size={16} color="#A78BFA" />
                          <span style={{ fontWeight: 800, color: '#DDD6FE', fontSize: '0.95rem' }}>
                            {item.totalVeEarned}{' '}
                            <span style={{ fontSize: '0.78rem', color: '#A78BFA', fontWeight: 600 }}>VEs</span>
                          </span>
                        </div>
                      </td>

                      {/* Wallet Balance Column */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            color: '#FDE68A',
                            fontWeight: 700,
                          }}
                        >
                          {item.walletVEs} VEs
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sticky Bottom Banner: Current Logged-in User Global Standing */}
      {currentUser && (
        <div
          style={{
            position: 'fixed',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '1050px',
            background: 'rgba(19, 11, 46, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.5)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(139, 92, 246, 0.35)',
            borderRadius: '20px',
            padding: '0.85rem 1.5rem',
            zIndex: 7000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* User Rank Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background:
                  currentUser.rank === 1
                    ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                    : currentUser.rank === 2
                    ? 'linear-gradient(135deg, #CBD5E1 0%, #64748B 100%)'
                    : currentUser.rank === 3
                    ? 'linear-gradient(135deg, #D97706 0%, #78350F 100%)'
                    : 'rgba(139, 92, 246, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1rem',
              }}
            >
              #{currentUser.rank}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#A78BFA', fontWeight: 600, textTransform: 'uppercase' }}>
                  Your Standing
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#34D399',
                    padding: '0.1rem 0.5rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                  }}
                >
                  Global Rank #{currentUser.rank} of {totalUsers}
                </span>
              </div>
              <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.98rem' }}>
                {currentUser.name}
              </div>
            </div>
          </div>

          {/* Stats Summary in Sticky Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Active Streak */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Flame size={18} color="#F59E0B" />
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Active Streak</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FBBF24' }}>
                  {currentUser.activeStreak} Days
                </div>
              </div>
            </div>

            {/* Total VEs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Coins size={18} color="#A78BFA" />
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>VE Balance</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#DDD6FE' }}>
                  {currentUser.walletVEs} VEs
                </div>
              </div>
            </div>

            {/* Link to Claim Today's Streak */}
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                color: '#FFFFFF',
                padding: '0.55rem 1.1rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: 'var(--primary-glow)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <span>Strengthen Streak</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
