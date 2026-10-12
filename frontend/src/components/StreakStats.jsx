import React from 'react';
import { Flame, Trophy, CalendarCheck2, Gift, Sparkles } from 'lucide-react';
import styles from '../pages/DailyStreak/DailyStreak.module.css';

const StreakStats = ({ stats = {} }) => {
  const currentStreak = stats.currentStreak || 0;
  const totalRewardsClaimed = stats.totalRewardsClaimed || 0;
  const checkedInDays = stats.totalRewardsClaimed || currentStreak;
  const nextReward = stats.nextReward ? stats.nextReward.title : '₹2 Amazon Gift Card';
  const isAmazonNext = nextReward?.toLowerCase().includes('amazon');

  return (
    <div className={styles.statsGrid}>
      {/* 1. Current Streak */}
      <div className={`${styles.statCard} ${styles.statCardStreak}`}>
        <div className={`${styles.statIconWrap} ${styles.statIconFlame}`}>
          <Flame size={24} color="#F59E0B" />
        </div>
        <div className={styles.statContent}>
          <div className={styles.statValue}>
            {currentStreak} <span className={styles.statUnit}>Days</span>
          </div>
          <div className={styles.statLabel}>Current Streak</div>
        </div>
      </div>

      {/* 2. Total Rewards Claimed */}
      <div className={`${styles.statCard} ${styles.statCardRewards}`}>
        <div className={`${styles.statIconWrap} ${styles.statIconTrophy}`}>
          <Trophy size={22} color="#FBBF24" />
        </div>
        <div className={styles.statContent}>
          <div className={styles.statValue}>{totalRewardsClaimed}</div>
          <div className={styles.statLabel}>Rewards Claimed</div>
        </div>
      </div>

      {/* 3. Checked-in Days */}
      <div className={`${styles.statCard} ${styles.statCardChecked}`}>
        <div className={`${styles.statIconWrap} ${styles.statIconCalendar}`}>
          <CalendarCheck2 size={22} color="#34D399" />
        </div>
        <div className={styles.statContent}>
          <div className={styles.statValue}>
            {checkedInDays} <span className={styles.statUnit}>Days</span>
          </div>
          <div className={styles.statLabel}>Checked-in Days</div>
        </div>
      </div>

      {/* 4. Next Reward */}
      <div className={`${styles.statCard} ${styles.statCardNext}`}>
        <div className={`${styles.statIconWrap} ${styles.statIconNext}`}>
          <Gift size={22} color={isAmazonNext ? '#F59E0B' : '#A78BFA'} />
        </div>
        <div className={styles.statContent}>
          <div
            className={`${styles.statValue} ${isAmazonNext ? styles.statValueAmazon : ''}`}
            style={{ fontSize: '1.15rem' }}
          >
            {nextReward}
          </div>
          <div className={styles.statLabel}>Next Reward</div>
        </div>
      </div>
    </div>
  );
};

export default StreakStats;
