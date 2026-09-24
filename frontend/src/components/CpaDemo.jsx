import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import styles from '../pages/DailyStreak/DailyStreak.module.css';

const CpaDemo = ({ onComplete, onCancel }) => {
  const [progress, setProgress] = useState(0);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsVerifying(false);
          // Call complete with token after a brief pause
          setTimeout(() => {
            onComplete(`cpa_demo_verified_${Date.now()}`);
          }, 400);
          return 100;
        }
        return Math.min(100, prev + step);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div className={styles.cpaNotice}>
        <ShieldCheck size={20} color="#A78BFA" style={{ flexShrink: 0 }} />
        <div>
          <strong>Sponsor Partner Verification</strong>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
            VELoop rewards are sponsored by our partner network. Verifying active user session...
          </div>
        </div>
      </div>

      {/* Mock Partner Card */}
      <div
        style={{
          background: 'rgba(23, 14, 56, 0.7)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <Sparkles size={28} color="#FBBF24" />
        <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>
          VELoop Rewards Network
        </div>
        <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
          Engaging with sponsored rewards ecosystem
        </div>
      </div>

      {/* Progress Bar */}
      <div className={styles.cpaProgressContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#C4B5FD' }}>
          <span>{isVerifying ? 'Verifying check-in engagement...' : 'Verification Complete!'}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className={styles.cpaProgressBar}>
          <div className={styles.cpaProgressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {!isVerifying && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            color: '#34D399',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginTop: '0.5rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>Reward ready for credit!</span>
        </div>
      )}
    </div>
  );
};

export default CpaDemo;
