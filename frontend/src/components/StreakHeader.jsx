import React from 'react';
import { Flame, Sparkles, RefreshCw } from 'lucide-react';
import styles from '../pages/DailyStreak/DailyStreak.module.css';

const StreakHeader = ({ cycleNumber = 1, currentStreak = 0, onRefresh, isRefreshing }) => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerTitleGroup}>
        <div className={styles.headerIconBadge}>
          <Flame size={28} color="#F59E0B" />
        </div>
        <div>
          <h1 className={styles.mainTitle}>VELoop Daily Streak & Rewards</h1>
          <p className={styles.subtitle}>
            Check in every consecutive day to maintain your streak and unlock Amazon Gift Cards!
          </p>
        </div>
      </div>

      <div className={styles.headerActions}>
        <div className={styles.cycleBadge}>
          <Sparkles size={16} color="#A78BFA" />
          <span>Cycle #{cycleNumber}</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span style={{ color: '#FBBF24' }}>Day {Math.min(currentStreak + 1, 7)} of 7</span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          style={{
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            color: '#DDD6FE',
            padding: '0.5rem 0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            fontWeight: 500,
            transition: 'all 0.2s ease',
          }}
          title="Refresh streak status"
        >
          <RefreshCw size={15} className={isRefreshing ? 'spin-anim' : ''} />
          <span>Sync</span>
        </button>
      </div>
    </div>
  );
};

export default StreakHeader;
