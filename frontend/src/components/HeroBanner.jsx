import React from 'react';
import { Flame, Clock, Gift, CheckCircle, Zap } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';
import styles from '../pages/DailyStreak/DailyStreak.module.css';

const HeroBanner = ({
  currentStreak = 0,
  currentDay = 1,
  canClaim = false,
  nextClaimAt = null,
  nextReward = null,
  onClaimClick,
  onCountdownExpire,
  isClaiming = false,
}) => {
  // Live countdown hook
  const { hours, minutes, seconds, isExpired } = useCountdown(nextClaimAt, onCountdownExpire);

  return (
    <div className={styles.heroBanner}>
      <div className={styles.heroContent}>
        {/* Left Column: Streak Info & Action */}
        <div className={styles.heroText}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#FBBF24',
                background: 'rgba(245, 158, 11, 0.15)',
                padding: '0.35rem 0.85rem',
                borderRadius: '20px',
                border: '1px solid rgba(245, 158, 11, 0.35)',
              }}
            >
              <Flame size={16} />
              {currentStreak} DAY STREAK
            </span>

            {canClaim && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#34D399',
                  background: 'rgba(16, 185, 129, 0.15)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                }}
              >
                <Zap size={14} /> READY TO CLAIM
              </span>
            )}
          </div>

          <h2>
            Day {currentDay}: Unlock{' '}
            <span className={styles.heroHighlight}>
              {nextReward ? nextReward.title : 'Daily Reward'}
            </span>
          </h2>

          <p className={styles.heroSubtext}>
            {canClaim
              ? 'Your reward for today is unlocked and ready to claim! Complete the quick partner verification to receive instant wallet credit.'
              : `You have successfully checked in today. Your Day ${currentDay} reward will unlock when the 24-hour cooldown timer finishes.`}
          </p>

          <div className={styles.heroActionGroup}>
            <button
              onClick={onClaimClick}
              disabled={!canClaim || isClaiming}
              className={`${styles.claimHeroBtn} ${canClaim ? styles.activeClaim : ''}`}
            >
              {canClaim ? (
                <>
                  <Gift size={20} />
                  <span>Claim Day {currentDay} Reward</span>
                </>
              ) : (
                <>
                  <Clock size={20} />
                  <span>Next Reward in {hours}:{minutes}:{seconds}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Timer or Ready Status */}
        <div className={styles.heroTimerCard}>
          <div className={styles.timerLabel}>
            <Clock size={16} />
            <span>{canClaim ? 'Status' : 'Next Reward Unlocks In'}</span>
          </div>

          {canClaim ? (
            <div style={{ padding: '1rem 0' }}>
              <div className={styles.timerReadyBadge}>
                <CheckCircle size={16} />
                <span>Cooldown Completed • Claim Available</span>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '0.75rem', margin: 0 }}>
                Claim before the 48h window to keep your streak intact!
              </p>
            </div>
          ) : (
            <>
              <div className={styles.countdownDisplay}>
                <div className={styles.timeSegment}>
                  <div className={styles.timeNumber}>{hours}</div>
                  <div className={styles.timeLabel}>Hours</div>
                </div>
                <div className={styles.timeColon}>:</div>
                <div className={styles.timeSegment}>
                  <div className={styles.timeNumber}>{minutes}</div>
                  <div className={styles.timeLabel}>Mins</div>
                </div>
                <div className={styles.timeColon}>:</div>
                <div className={styles.timeSegment}>
                  <div className={styles.timeNumber}>{seconds}</div>
                  <div className={styles.timeLabel}>Secs</div>
                </div>
              </div>
              <p style={{ color: '#64748B', fontSize: '0.8rem', margin: 0 }}>
                Synced directly with VELoop secure server time
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
