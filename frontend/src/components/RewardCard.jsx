import React from 'react';
import {
  Coins,
  Flame,
  Zap,
  Gift,
  ShoppingBag,
  Award,
  Crown,
  Lock,
  Check,
  Clock,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
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

  // Icon mapping
  const renderIcon = () => {
    const iconSize = 24;
    switch (dayNumber) {
      case 1:
        return <Coins size={iconSize} color="#A78BFA" />;
      case 2:
        return <Flame size={iconSize} color="#F59E0B" />;
      case 3:
        return <Zap size={iconSize} color="#EC4899" />;
      case 4:
        return <Gift size={iconSize} color="#FBBF24" />;
      case 5:
        return <ShoppingBag size={iconSize} color="#EAB308" />;
      case 6:
        return <Award size={iconSize} color="#06B6D4" />;
      case 7:
        return <Crown size={iconSize} color="#FBBF24" />;
      default:
        return <Gift size={iconSize} color="#A78BFA" />;
    }
  };

  // Determine container class based on state
  let stateClass = styles.cardLocked;
  if (state === 'AVAILABLE') stateClass = styles.cardAvailable;
  else if (state === 'TODAY') stateClass = styles.cardToday;
  else if (state === 'CLAIMED') stateClass = styles.cardClaimed;
  else if (state === 'MISSED') stateClass = styles.cardMissed;

  const ultimateClass = isUltimateReward ? styles.cardUltimate : '';

  return (
    <div className={`${styles.rewardCard} ${stateClass} ${ultimateClass}`}>
      {/* Top Day Badge */}
      <div
        className={`${styles.dayBadge} ${
          state === 'AVAILABLE' || state === 'TODAY' ? styles.dayBadgeActive : ''
        }`}
      >
        Day {dayNumber}
      </div>

      {/* Reward Icon */}
      <div
        className={styles.cardIconBox}
        style={{
          background:
            state === 'CLAIMED'
              ? 'rgba(16, 185, 129, 0.2)'
              : isUltimateReward
              ? 'rgba(245, 158, 11, 0.25)'
              : 'rgba(139, 92, 246, 0.15)',
        }}
      >
        {state === 'CLAIMED' ? <Check size={24} color="#34D399" /> : renderIcon()}
      </div>

      {/* Reward Value */}
      <div className={styles.cardValueText}>{title}</div>
      <div className={styles.cardDescText}>
        {rewardType === 'AMAZON_GIFT_CARD' ? 'Amazon Voucher' : 'Virtual Currency'}
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
            <Check size={14} />
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
