import React, { useState } from 'react';
import { FastForward, AlertTriangle, Wrench, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { devAdvanceDay, devSimulateMissed } from '../services/streakApi';
import { useToast } from '../context/ToastContext';

const DevControls = ({ onActionSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const { showToast } = useToast();

  const handleAdvanceDay = async () => {
    try {
      setLoadingAction(true);
      const res = await devAdvanceDay();
      showToast(res.message || 'Cooldown bypassed! Next day is now available to claim.', 'success');
      if (onActionSuccess) onActionSuccess();
    } catch (err) {
      showToast(err.message || 'Failed to advance day', 'error');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSimulateMissed = async () => {
    try {
      setLoadingAction(true);
      const res = await devSimulateMissed();
      showToast(res.message || 'Missed-day simulated! Streak has reset to Day 1.', 'warning');
      if (onActionSuccess) onActionSuccess();
    } catch (err) {
      showToast(err.message || 'Failed to simulate missed day', 'error');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '20px',
        zIndex: 9000,
      }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(23, 14, 56, 0.95)',
          border: '1px solid rgba(245, 158, 11, 0.5)',
          borderRadius: '24px',
          padding: '0.5rem 1rem',
          color: '#FBBF24',
          fontSize: '0.8rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Wrench size={14} />
        <span>Dev Simulation Bar</span>
        {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>

      {/* Expanded panel */}
      {isOpen && (
        <div
          style={{
            marginTop: '8px',
            background: 'rgba(13, 7, 33, 0.96)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            borderRadius: '16px',
            padding: '1rem',
            width: '320px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#FFFFFF',
              marginBottom: '0.35rem',
            }}
          >
            🧪 Developer Testing Controls
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.75rem' }}>
            Simulate 24h time-jumps & missed-day windows without waiting real calendar days:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={handleAdvanceDay}
              disabled={loadingAction}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#FFFFFF',
                padding: '0.45rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <FastForward size={14} />
              <span>Fast-Forward 24h Cooldown</span>
            </button>

            <button
              onClick={handleSimulateMissed}
              disabled={loadingAction}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '8px',
                color: '#F87171',
                padding: '0.45rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <AlertTriangle size={14} />
              <span>Simulate Missed Day (Reset to Day 1)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevControls;
