import React from 'react';
import { Crown, Sparkles, ArrowRight } from 'lucide-react';
import styles from '../pages/DailyStreak/DailyStreak.module.css';

const UltimateReward = ({ currentStreak = 0, ultimateReward = null }) => {
  const daysRemaining = Math.max(0, 7 - currentStreak);
  const isUnlocked = currentStreak >= 7;

  return (
    <div className={styles.ultimateSection}>
      <div className={styles.ultimateCard}>
        <div className={styles.ultimateLeft}>
          <div className={styles.ultimateCrownBadge}>
            <Crown size={32} />
          </div>
          <div className={styles.ultimateInfo}>
            <h3>
              <span>Day 7 Ultimate Grand Prize</span>
              <span className={styles.ultimatePill}>
                <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Grand Finale
              </span>
            </h3>
            <p className={styles.ultimateDesc}>
              {isUnlocked
                ? '🎉 You have conquered the 7-day streak! Your ₹5 Amazon Gift Card has been credited to your wallet.'
                : `Maintain your streak for ${daysRemaining} more consecutive ${daysRemaining === 1 ? 'day' : 'days'} to claim the ₹5 Amazon Gift Card Voucher!`}
            </p>
          </div>
        </div>

        <div className={styles.ultimateRewardTag}>
          <div>{ultimateReward ? ultimateReward.title : '₹5 Amazon Voucher'}</div>
          <div className={styles.ultimateSubtitle}>
            {isUnlocked ? 'Unlocked & Claimed' : `${currentStreak} / 7 Days Completed`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltimateReward;
