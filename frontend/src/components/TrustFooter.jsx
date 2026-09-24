import React from 'react';
import { ShieldCheck, Lock, Award, Clock } from 'lucide-react';
import styles from '../pages/DailyStreak/DailyStreak.module.css';

const TrustFooter = () => {
  return (
    <footer className={styles.trustFooter}>
      <div className={styles.trustBadges}>
        <div className={styles.trustItem}>
          <ShieldCheck size={18} color="#10B981" />
          <span>Server-Side Verified Payouts</span>
        </div>
        <div className={styles.trustItem}>
          <Clock size={18} color="#8B5CF6" />
          <span>Atomic 24h Cooldown Timers</span>
        </div>
        <div className={styles.trustItem}>
          <Lock size={18} color="#F59E0B" />
          <span>Anti-Fraud & Duplicate Protected</span>
        </div>
        <div className={styles.trustItem}>
          <Award size={18} color="#FBBF24" />
          <span>Official Amazon Partner Vouchers</span>
        </div>
      </div>

      <div style={{ marginTop: '0.75rem' }}>
        © {new Date().getFullYear()} VELoop Rewards Ecosystem. All rights reserved.
      </div>
    </footer>
  );
};

export default TrustFooter;
