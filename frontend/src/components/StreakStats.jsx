import React from 'react';
import { Flame, Award, Calendar, Gift } from 'lucide-react';
import styles from '../pages/DailyStreak/DailyStreak.module.css';

const StreakStats = ({ stats = {} }) => {
  const currentStreak = stats.currentStreak || 0;
  const totalRewardsClaimed = stats.totalRewardsClaimed || 0;
  const checkedInDays = stats.totalRewardsClaimed || currentStreak;
  const nextReward = stats.nextReward ? stats.nextReward.title : 'Loading...';

  return (
    <div className={styles.statsGrid}>
      {/* 1. Current Streak */}
      <div className={styles.statCard}>
        <div className={`${styles.statIconWrap} ${styles.statIconPurple}`}>
          <Flame size={24} />
        </div>
        <div>
          <div className={styles.statValue}>{currentStreak} Days</div>
          <div className={styles.statLabel}>Current Streak</div>
        </div>
      </div>

      {/* 2. Total Rewards Claimed */}
      <div className={styles.statCard}>
        <div className={`${styles.statIconWrap} ${styles.statIconGold}`}>
          <Award size={24} />
        </div>
        <div>
          <div className={styles.statValue}>{totalRewardsClaimed}</div>
          <div className={styles.statLabel}>Total Rewards</div>
        </div>
      </div>

      {/* 3. Checked-in Days */}
      <div className={styles.statCard}>
        <div className={`${styles.statIconWrap} ${styles.statIconGreen}`}>
          <Calendar size={24} />
        </div>
        <div>
          <div className={styles.statValue}>{checkedInDays}</div>
          <div className={styles.statLabel}>Checked-in Days</div>
        </div>
      </div>

      {/* 4. Next Reward */}
      <div className={styles.statCard}>
        <div className={`${styles.statIconWrap} ${styles.statIconBlue}`}>
          <Gift size={24} />
        </div>
        <div>
          <div className={styles.statValue} style={{ fontSize: '1.25rem' }}>
            {nextReward}
          </div>
          <div className={styles.statLabel}>Next Reward</div>
        </div>
      </div>
    </div>
  );
};

export default StreakStats;
