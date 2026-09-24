import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Flame,
  Coins,
  Gift,
  Award,
  Layers,
  FileText,
  Edit,
  CheckCircle2,
  Save,
  X,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  getAdminOverview,
  getAdminUsers,
  getAdminRewards,
  updateAdminReward,
  getAdminClaims,
  getAdminAuditLogs,
} from '../../services/streakApi';
import { formatDate } from '../../utils/formatters';
import StreakLoader from '../../components/StreakLoader';

const AdminPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'rewards' | 'users' | 'claims'
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [claims, setClaims] = useState([]);
  const [editingReward, setEditingReward] = useState(null);
  const [savingReward, setSavingReward] = useState(false);

  const isAdmin = user?.role === 'admin';

  const loadData = async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [ovRes, uRes, rRes, cRes] = await Promise.all([
        getAdminOverview(),
        getAdminUsers(),
        getAdminRewards(),
        getAdminClaims(),
      ]);

      if (ovRes.success) setOverview(ovRes.data);
      if (uRes.success) setUsers(uRes.data);
      if (rRes.success) setRewards(rRes.data.rewards);
      if (cRes.success) setClaims(cRes.data);
    } catch (err) {
      showToast(err.message || 'Failed to load admin panel data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleEditReward = (reward) => {
    setEditingReward({ ...reward });
  };

  const handleSaveReward = async () => {
    try {
      setSavingReward(true);
      const res = await updateAdminReward(editingReward._id, {
        title: editingReward.title,
        value: Number(editingReward.value),
        currency: editingReward.currency,
        badgeText: editingReward.badgeText,
      });

      if (res.success) {
        showToast(res.message || 'Reward updated successfully!', 'success');
        setRewards((prev) =>
          prev.map((r) => (r._id === editingReward._id ? res.data : r))
        );
        setEditingReward(null);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update reward', 'error');
    } finally {
      setSavingReward(false);
    }
  };

  // If user is not an admin, display access denied banner
  if (!isAdmin && !loading) {
    return (
      <div style={{ maxWidth: '650px', margin: '4rem auto', padding: '1rem', textAlign: 'center' }}>
        <div
          className="glass-panel"
          style={{
            padding: '3rem 2rem',
            borderRadius: '24px',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            boxShadow: '0 0 35px rgba(239, 68, 68, 0.25)',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              color: '#F87171',
            }}
          >
            <ShieldAlert size={38} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF' }}>
            Administrator Access Required
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
            The VELoop Admin Panel is restricted to authorized operators with the <strong>admin</strong> role.
            Your current logged-in role is: <span style={{ color: '#FBBF24', fontWeight: 700 }}>{user?.role || 'user'}</span>.
          </p>

          <div
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px dashed rgba(245, 158, 11, 0.4)',
              borderRadius: '14px',
              padding: '1.25rem',
              marginTop: '1.75rem',
              textAlign: 'left',
              fontSize: '0.88rem',
            }}
          >
            <div style={{ fontWeight: 700, color: '#FBBF24', marginBottom: '0.35rem' }}>
              🔑 Pre-Seeded Admin Account:
            </div>
            <div style={{ color: '#DDD6FE' }}>
              • <strong>Email:</strong> <code>luckyjai898@veloop.com</code><br />
              • <strong>Password:</strong> <code>Password123!</code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <StreakLoader message="Loading VELoop Administration Panel..." />;
  }

  const tabStyle = (tabKey) => ({
    padding: '0.65rem 1.25rem',
    borderRadius: '12px',
    border: 'none',
    background: activeTab === tabKey ? 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' : 'rgba(255, 255, 255, 0.05)',
    color: activeTab === tabKey ? '#FFFFFF' : '#94A3B8',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem 4rem 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#FBBF24', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            OPERATOR DASHBOARD
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            VELoop Rewards Administration
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Manage reward ladder configurations, inspect circulating currencies, and monitor audit trails.
          </p>
        </div>

        <button
          onClick={loadData}
          style={{
            background: 'rgba(139, 92, 246, 0.2)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            borderRadius: '12px',
            color: '#DDD6FE',
            padding: '0.6rem 1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
          }}
        >
          <RefreshCw size={16} />
          <span>Sync Data</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>
          <Layers size={18} />
          <span>System Metrics</span>
        </button>
        <button style={tabStyle('rewards')} onClick={() => setActiveTab('rewards')}>
          <Gift size={18} />
          <span>7-Day Rewards Ladder</span>
        </button>
        <button style={tabStyle('users')} onClick={() => setActiveTab('users')}>
          <Users size={18} />
          <span>Users & Wallets ({users.length})</span>
        </button>
        <button style={tabStyle('claims')} onClick={() => setActiveTab('claims')}>
          <Award size={18} />
          <span>Global Claims Stream</span>
        </button>
      </div>

      {/* TAB 1: System Metrics */}
      {activeTab === 'overview' && overview && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '18px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#A78BFA', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Registered Users</span>
                <Users size={22} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>{overview.totalUsers}</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.35rem' }}>Active database accounts</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '18px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#FBBF24', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Streaks</span>
                <Flame size={22} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FBBF24' }}>{overview.activeCycles}</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.35rem' }}>Active 7-day cycles in progress</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '18px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#34D399', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>VE Coins Distributed</span>
                <Coins size={22} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34D399' }}>{overview.totalVeCirculating} VEs</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.35rem' }}>Total in user wallets</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '18px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#FBBF24', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Amazon Gift Vouchers</span>
                <Gift size={22} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>
                ₹{overview.totalAmazonCash}{' '}
                <span style={{ fontSize: '1rem', color: '#FDE68A' }}>({overview.totalAmazonVouchers} issued)</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.35rem' }}>Digital Amazon Pay codes</div>
            </div>
          </div>

          {/* Recent Claims Widget */}
          <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem' }}>
              Recent Check-in Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {overview.recentClaims?.map((claim) => (
                <div
                  key={claim._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: 'rgba(13, 7, 33, 0.7)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#FFFFFF' }}>
                      {claim.userId?.name?.[0] || 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.9rem' }}>
                        {claim.userId?.name} <span style={{ color: '#94A3B8', fontWeight: 400 }}>claimed Day {claim.dayNumber}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#FBBF24' }}>
                        Reward: {claim.rewardSnapshot?.title}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#94A3B8' }}>
                    {formatDate(claim.claimedAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Reward Ladder Config */}
      {activeTab === 'rewards' && (
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                7-Day Streak Reward Ladder (MongoDB Source of Truth)
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                All modifications update MongoDB instantly and propagate to user check-ins.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(13, 7, 33, 0.7)', borderBottom: '1px solid var(--border-subtle)', color: '#94A3B8' }}>
                  <th style={{ padding: '1rem' }}>Day</th>
                  <th style={{ padding: '1rem' }}>Title</th>
                  <th style={{ padding: '1rem' }}>Type</th>
                  <th style={{ padding: '1rem' }}>Value & Currency</th>
                  <th style={{ padding: '1rem' }}>Badge Label</th>
                  <th style={{ padding: '1rem' }}>Grand Prize</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((reward) => (
                  <tr key={reward._id} style={{ borderBottom: '1px solid rgba(139, 92, 246, 0.1)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#DDD6FE' }}>Day {reward.dayNumber}</td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#FFFFFF' }}>{reward.title}</td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          background: reward.rewardType === 'AMAZON_GIFT_CARD' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                          color: reward.rewardType === 'AMAZON_GIFT_CARD' ? '#FBBF24' : '#A78BFA',
                        }}
                      >
                        {reward.rewardType}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#FBBF24' }}>
                      {reward.value} {reward.currency}
                    </td>
                    <td style={{ padding: '1rem', color: '#94A3B8' }}>{reward.badgeText || '—'}</td>
                    <td style={{ padding: '1rem' }}>
                      {reward.isUltimateReward ? (
                        <span style={{ color: '#FBBF24', fontWeight: 700 }}>★ ULTIMATE</span>
                      ) : (
                        <span style={{ color: '#64748B' }}>Standard</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEditReward(reward)}
                        style={{
                          background: 'rgba(139, 92, 246, 0.15)',
                          border: '1px solid rgba(139, 92, 246, 0.35)',
                          borderRadius: '8px',
                          color: '#DDD6FE',
                          padding: '0.35rem 0.65rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.8rem',
                        }}
                      >
                        <Edit size={14} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Reward Modal */}
      {editingReward && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid var(--border-active)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                Edit Day {editingReward.dayNumber} Reward
              </h3>
              <button
                onClick={() => setEditingReward(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#DDD6FE', marginBottom: '0.3rem' }}>
                  Reward Title Display
                </label>
                <input
                  type="text"
                  value={editingReward.title}
                  onChange={(e) => setEditingReward({ ...editingReward, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(13, 7, 33, 0.8)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#DDD6FE', marginBottom: '0.3rem' }}>
                  Reward Value Amount
                </label>
                <input
                  type="number"
                  value={editingReward.value}
                  onChange={(e) => setEditingReward({ ...editingReward, value: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(13, 7, 33, 0.8)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#DDD6FE', marginBottom: '0.3rem' }}>
                  Badge Label
                </label>
                <input
                  type="text"
                  value={editingReward.badgeText}
                  onChange={(e) => setEditingReward({ ...editingReward, badgeText: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(13, 7, 33, 0.8)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  onClick={handleSaveReward}
                  disabled={savingReward}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Save size={16} /> {savingReward ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setEditingReward(null)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Users & Wallets */}
      {activeTab === 'users' && (
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem' }}>
            Registered Users & Wallets
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(13, 7, 33, 0.7)', borderBottom: '1px solid var(--border-subtle)', color: '#94A3B8' }}>
                  <th style={{ padding: '1rem' }}>User</th>
                  <th style={{ padding: '1rem' }}>Role</th>
                  <th style={{ padding: '1rem' }}>VE Balance</th>
                  <th style={{ padding: '1rem' }}>Amazon Vouchers</th>
                  <th style={{ padding: '1rem' }}>Current Streak</th>
                  <th style={{ padding: '1rem' }}>Total Claims</th>
                  <th style={{ padding: '1rem' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(139, 92, 246, 0.1)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{u.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '8px',
                          background: u.role === 'admin' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(124, 58, 237, 0.2)',
                          color: u.role === 'admin' ? '#FBBF24' : '#A78BFA',
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#DDD6FE' }}>{u.veBalance} VEs</td>
                    <td style={{ padding: '1rem', color: '#FBBF24', fontWeight: 600 }}>{u.amazonVouchersCount} vouchers</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ color: '#FBBF24', fontWeight: 700 }}>{u.currentStreak} Days</span>
                    </td>
                    <td style={{ padding: '1rem', color: '#E2E8F0' }}>{u.totalClaims}</td>
                    <td style={{ padding: '1rem', color: '#94A3B8' }}>{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Global Claims Stream */}
      {activeTab === 'claims' && (
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem' }}>
            Live Streak Claims Stream
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(13, 7, 33, 0.7)', borderBottom: '1px solid var(--border-subtle)', color: '#94A3B8' }}>
                  <th style={{ padding: '1rem' }}>User</th>
                  <th style={{ padding: '1rem' }}>Cycle & Day</th>
                  <th style={{ padding: '1rem' }}>Reward Awarded</th>
                  <th style={{ padding: '1rem' }}>CPA Status</th>
                  <th style={{ padding: '1rem' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim._id} style={{ borderBottom: '1px solid rgba(139, 92, 246, 0.1)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{claim.userId?.name || 'User'}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{claim.userId?.email}</div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#DDD6FE' }}>
                      C#{claim.cycleNumber} • Day {claim.dayNumber}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#FBBF24' }}>
                      {claim.rewardSnapshot?.title}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34D399', background: 'rgba(16, 185, 129, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                        {claim.cpaStatus}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#94A3B8' }}>{formatDate(claim.claimedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
