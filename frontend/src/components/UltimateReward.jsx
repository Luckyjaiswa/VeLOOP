import React from 'react';
import { Sparkles, Trophy, CheckCircle2, ChevronRight, Gift } from 'lucide-react';
import { UltimateCrownAsset, AmazonGiftCardAsset } from './RewardAssetBadge';
import styles from '../pages/DailyStreak/DailyStreak.module.css';

const UltimateReward = ({ currentStreak = 0, ultimateReward = null }) => {
  const daysRemaining = Math.max(0, 7 - currentStreak);
  const isUnlocked = currentStreak >= 7;
  const progressPercent = Math.min(100, Math.round((currentStreak / 7) * 100));

  return (
    <div className={styles.ultimateSection}>
      <div className={styles.ultimateCard}>
        {/* Animated Golden Accent Border Light */}
        <div className={styles.ultimateCardGlowBg} />

        <div className={styles.ultimateTopRow}>
          {/* Left: Authentic 3D Royal Crown & Grand Prize Trophy Asset */}
          <div className={styles.ultimateAssetWrap}>
            <UltimateCrownAsset size="md" />
            <div className={styles.ultimateAuraRing} />
          </div>

          {/* Middle: Title & Streak Incentive Text */}
          <div className={styles.ultimateInfo}>
            <div className={styles.ultimateHeaderMeta}>
              <span className={styles.ultimatePill}>
                <Sparkles size={12} />
                Grand Finale
              </span>
              <span className={styles.ultimateDayTag}>Day 7 Milestone</span>
            </div>

            <h3 className={styles.ultimateMainHeading}>
              Day 7 Ultimate Grand Prize
            </h3>

            <p className={styles.ultimateDesc}>
              {isUnlocked
                ? '🎉 Congratulations! You conquered the full 7-day streak cycle. Your ₹5 Amazon Gift Card Voucher is unlocked and ready in your wallet!'
                : `Maintain your streak for ${daysRemaining} more consecutive ${
                    daysRemaining === 1 ? 'day' : 'days'
                  } to claim the guaranteed ₹5 Amazon Gift Card Voucher!`}
            </p>
          </div>

          {/* Right: Reward Value Banner Tag */}
          <div className={styles.ultimatePrizeBox}>
            <div className={styles.ultimateRewardTag}>
              {ultimateReward ? ultimateReward.title : '₹5 Amazon Gift Card'}
            </div>
            <div className={styles.ultimateSubtitle}>
              {isUnlocked ? (
                <span style={{ color: '#34D399', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> Unlocked & Claimed
                </span>
              ) : (
                `${currentStreak} / 7 DAYS COMPLETED`
              )}
            </div>
          </div>
        </div>

        {/* Bottom: Interactive 7-Day Streak Pathway Progress Bar */}
        <div className={styles.ultimateProgressContainer}>
          <div className={styles.ultimateProgressMeta}>
            <span className={styles.progressLabel}>
              <Trophy size={14} style={{ color: '#FBBF24', marginRight: '6px' }} />
              7-Day Grand Prize Streak Pathway
            </span>
            <span className={styles.progressPercentText}>
              {currentStreak}/7 Days ({progressPercent}%)
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className={styles.ultimateProgressBar}>
            <div
              className={styles.ultimateProgressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 7-Day Step Nodes */}
          <div className={styles.ultimateStepsRow}>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const isPassed = currentStreak >= day;
              const isCurrent = currentStreak + 1 === day && currentStreak < 7;
              const isGrand = day === 7;

              return (
                <div
                  key={day}
                  className={`${styles.stepNode} ${isPassed ? styles.stepPassed : ''} ${
                    isCurrent ? styles.stepActive : ''
                  } ${isGrand ? styles.stepGrand : ''}`}
                  title={`Day ${day}: ${day === 7 ? '₹5 Amazon Gift Card' : day === 4 ? '₹1 Amazon Card' : day === 5 ? '₹2 Amazon Card' : 'VEs'}`}
                >
                  <div className={styles.stepDot}>
                    {isGrand ? (
                      '👑'
                    ) : isPassed ? (
                      '✓'
                    ) : (
                      `D${day}`
                    )}
                  </div>
                  <span className={styles.stepLabel}>
                    {isGrand ? 'Grand' : `Day ${day}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltimateReward;
