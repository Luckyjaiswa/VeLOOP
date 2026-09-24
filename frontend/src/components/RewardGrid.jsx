import React from 'react';
import RewardCard from './RewardCard';
import styles from '../pages/DailyStreak/DailyStreak.module.css';

const RewardGrid = ({ days = [], onClaim, isClaiming }) => {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div className={styles.gridSectionTitle}>
        <span>7-Day Reward Pathway</span>
        <span className={styles.cycleTrackInfo}>Complete all 7 days to unlock the Grand Prize</span>
      </div>

      <div className={styles.rewardsGrid}>
        {days.map((reward) => (
          <RewardCard
            key={reward.dayNumber}
            reward={reward}
            onClaim={onClaim}
            isClaiming={isClaiming}
          />
        ))}
      </div>
    </div>
  );
};

export default RewardGrid;
