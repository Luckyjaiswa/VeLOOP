import React from 'react';
import styles from '../pages/DailyStreak/DailyStreak.module.css';

const StreakSkeleton = () => {
  return (
    <div className={styles.pageContainer}>
      {/* 1. Header Skeleton */}
      <div
        className={`${styles.skeletonHeader} shimmer-effect`}
        style={{
          width: '60%',
          marginBottom: '2rem',
          borderRadius: '14px',
        }}
      />

      {/* 2. Hero Banner Skeleton */}
      <div
        className={`${styles.skeletonHero} shimmer-effect`}
        style={{
          marginBottom: '2rem',
          borderRadius: '24px',
        }}
      />

      {/* 3. Statistics Skeleton */}
      <div className={styles.statsGrid} style={{ marginBottom: '2rem' }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`${styles.skeletonStats} shimmer-effect`}
            style={{ borderRadius: '18px' }}
          />
        ))}
      </div>

      {/* 4. Ultimate Reward Banner Skeleton */}
      <div
        className="shimmer-effect"
        style={{
          height: '110px',
          borderRadius: '22px',
          marginBottom: '2.5rem',
        }}
      />

      {/* 5. 7 Reward Cards Skeleton */}
      <div className={styles.rewardsGrid}>
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className={`${styles.skeletonCard} shimmer-effect`}
            style={{ borderRadius: '18px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default StreakSkeleton;
