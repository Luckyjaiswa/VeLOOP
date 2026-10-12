import React from 'react';
import {
  Check,
  Lock,
  Clock,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import RewardAssetBadge from './RewardAssetBadge';
import styles from '../pages/DailyStreak/DailyStreak.module.css';

const RewardCard = ({ reward, onClaim, isClaiming }) => {
  const {
    dayNumber,
    title,
    description,
    rewardType,
    value,
    currency,
    state, // 'LOCKED' | 'AVAILABLE' | 'TODAY' | 'CLAIMED' | 'MISSED'
    isUltimateReward,
    badgeText,
  } = reward;

  const isAmazonCard = rewardType === 'AMAZON_GIFT_CARD' || title?.toLowerCase().includes('amazon');

  // Determine container class based on state
  let stateClass = styles.cardLocked;
  if (state === 'AVAILABLE') stateClass = styles.cardAvailable;
  else if (state === 'TODAY') stateClass = styles.cardToday;
  else if (state === 'CLAIMED') stateClass = styles.cardClaimed;
  else if (state === 'MISSED') stateClass = styles.cardMissed;

  const ultimateClass = isUltimateReward ? styles.cardUltimate : '';
  const amazonClass = isAmazonCard ? styles.cardAmazonReward : '';

  return (
    <div className={`${styles.rewardCard} ${stateClass} ${ultimateClass} ${amazonClass}`}>
      {/* Top Day Badge */}
      <div className={styles.cardHeaderRow}>
        <div
          className={`${styles.dayBadge} ${
            state === 'AVAILABLE' || state === 'TODAY' ? styles.dayBadgeActive : ''
          } ${isUltimateReward ? styles.dayBadgeUltimate : ''}`}
        >
          {isUltimateReward ? '👑 Day 7 Grand' : `Day ${dayNumber}`}
        </div>
        {isUltimateReward && (
          <span className={styles.ultimateMicroBadge}>Finale</span>
        )}
      </div>

      {/* Reward Authentic Visual Asset Badge */}
      <div className={styles.cardAssetBox}>
        <RewardAssetBadge
          dayNumber={dayNumber}
          reward={reward}
          size={isUltimateReward ? 'md' : 'sm'}
        />

        {/* Claimed Verification Stamp Overlay */}
        {state === 'CLAIMED' && (
          <div className={styles.claimedSealOverlay} title="Claimed">
            <Check size={16} strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Reward Value Title */}
      <div className={styles.cardInfoGroup}>
        <div
          className={`${styles.cardValueText} ${
            isAmazonCard ? styles.amazonValueText : ''
          } ${isUltimateReward ? styles.ultimateValueText : ''}`}
        >
          {title}
        </div>
        <div className={styles.cardDescText}>
          {isAmazonCard ? (
            <span className={styles.amazonBadgeLabel}>
              <span className={styles.amazonSmileDot}>•</span> Amazon Voucher
            </span>
          ) : (
            <span className={styles.veBadgeLabel}>
              <span className={styles.veDot}>•</span> Virtual Currency
            </span>
          )}
        </div>
      </div>

      {/* State-specific Footer Action / Badge */}
      <div className={styles.cardFooter}>
        {state === 'AVAILABLE' && (
          <button
            onClick={() => onClaim(reward)}
            disabled={isClaiming}
            className={styles.claimCardBtn}
          >
            <Sparkles size={14} />
            <span>Claim</span>
          </button>
        )}

        {state === 'CLAIMED' && (
          <div className={styles.claimedBadge}>
            <Check size={13} strokeWidth={2.5} />
            <span>Claimed</span>
          </div>
        )}

        {state === 'TODAY' && (
          <div className={styles.todayCooldownBadge}>
            <Clock size={13} />
            <span>Cooldown</span>
          </div>
        )}

        {state === 'LOCKED' && (
          <div className={styles.lockedBadge}>
            <Lock size={13} />
            <span>Locked</span>
          </div>
        )}

        {state === 'MISSED' && (
          <div className={styles.missedBadge}>
            <AlertTriangle size={13} />
            <span>Missed</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardCard;
