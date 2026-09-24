import React, { useState } from 'react';
import { User, Mail, Shield, Calendar, Award, Flame, Check, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/streakApi';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty', 'warning');
      return;
    }

    try {
      setSaving(true);
      const res = await updateProfile({ name });
      if (res.success) {
        showToast('Profile updated successfully!', 'success');
        setIsEditing(false);
        refreshUser();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem 1rem 4rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
          User Profile & Settings
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginTop: '0.3rem' }}>
          Manage your account credentials and view your VELoop streak achievements
        </p>
      </div>

      {/* Main Profile Card */}
      <div
        className="glass-panel"
        style={{
          padding: '2.25rem',
          borderRadius: '24px',
          border: '1px solid var(--border-active)',
          boxShadow: 'var(--primary-glow)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
            alt="Profile Avatar"
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '24px',
              objectFit: 'cover',
              border: '2px solid #8B5CF6',
              boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)',
            }}
          />

          <div style={{ flex: 1 }}>
            {isEditing ? (
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    background: 'rgba(13, 7, 33, 0.8)',
                    border: '1px solid #8B5CF6',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    padding: '0.5rem 0.75rem',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                  }}
                />
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {user?.name}
                </h2>
                <button
                  onClick={() => {
                    setName(user?.name || '');
                    setIsEditing(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#A78BFA',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                  title="Edit Name"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            )}
            <div style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '0.2rem' }}>{user?.email}</div>
          </div>
        </div>

        {/* Info Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar size={18} color="#A78BFA" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Member Since</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>{formatDate(user?.createdAt)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield size={18} color="#10B981" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Account Security</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#34D399' }}>JWT Protected & Active</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Award size={18} color="#FBBF24" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Role</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FBBF24', textTransform: 'capitalize' }}>
                {user?.role || 'Verified User'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges and Milestones */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem' }}>
        Streak Badges & Milestones
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem',
            borderRadius: '16px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(124, 58, 237, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#A78BFA',
            }}
          >
            <Flame size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>Streak Pioneer</div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Initiated first 7-day cycle</div>
          </div>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: '1.25rem',
            borderRadius: '16px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FBBF24',
            }}
          >
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>Voucher Hunter</div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Eligible for Amazon Gift Cards</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
