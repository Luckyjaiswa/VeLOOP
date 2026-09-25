import React, { useState, useEffect, useCallback } from 'react';
import { getDailyStreak, getStreakStatus, claimDailyReward } from '../../services/streakApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// Components
import StreakHeader from '../../components/StreakHeader';
import HeroBanner from '../../components/HeroBanner';
import StreakStats from '../../components/StreakStats';
import UltimateReward from '../../components/UltimateReward';
import RewardGrid from '../../components/RewardGrid';
import ClaimModal from '../../components/ClaimModal';
import StreakSkeleton from '../../components/StreakSkeleton';
import WhyStreak from '../../components/WhyStreak';
import TrustFooter from '../../components/TrustFooter';
import DevControls from '../../components/DevControls';
import StreakFreezeCard from '../../components/StreakFreezeCard';
import RewardsStore from '../../components/RewardsStore';

import styles from './DailyStreak.module.css';

const DailyStreakPage = () => {
  const { user, updateWalletSummary } = useAuth();
  const { showToast } = useToast();

  const isAdmin =
    user &&
    (user.role === 'admin' ||
      user.isAdmin === true ||
      user.email === 'luckyjai898@veloop.com');

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [selectedRewardToClaim, setSelectedRewardToClaim] = useState(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  // Fetch full dashboard from backend
  const fetchDashboard = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const res = await getDailyStreak();
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load streak status', 'error');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDashboard(true);
  }, [fetchDashboard]);

  // Handle manual refresh sync
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboard(false);
  };

  // When countdown timer hits zero, verify with backend
  const handleCountdownExpire = async () => {
    try {
      // Re-fetch backend status
      const statusRes = await getStreakStatus();
      if (statusRes.success) {
        if (statusRes.canClaim) {
          showToast('🎉 Your daily reward is now unlocked and ready to claim!', 'success');
        }
        // Sync full dashboard state
        fetchDashboard(false);
      }
    } catch (err) {
      console.warn('Status check failed on countdown expire:', err);
    }
  };

  // Open claim modal for available reward
  const handleOpenClaim = (reward) => {
    if (!dashboardData?.eligibility?.canClaim) {
      showToast('This reward is currently in cooldown or locked.', 'warning');
      return;
    }
    setSelectedRewardToClaim(reward);
    setIsClaimModalOpen(true);
  };

  // Execute reward claim via backend API
  const handleClaimConfirmed = async ({ cpaToken, cpaEngagementSeconds }) => {
    try {
      setIsClaiming(true);
      const res = await claimDailyReward({
        cpaToken,
        cpaEngagementSeconds,
      });

      if (res.success) {
        showToast(res.message || 'Reward claimed successfully!', 'success');

        // Update local dashboard state with backend response
        if (res.dashboard) {
          setDashboardData(res.dashboard);
        } else {
          fetchDashboard(false);
        }

        // Update global wallet balance in navbar
        if (res.wallet) {
          updateWalletSummary(res.wallet);
        }

        return res;
      } else {
        throw new Error(res.message || 'Claim failed');
      }
    } catch (err) {
      showToast(err.message || 'Failed to claim reward. Please try again.', 'error');
      throw err;
    } finally {
      setIsClaiming(false);
    }
  };

  if (loading && !dashboardData) {
    return <StreakSkeleton />;
  }

  const {
    cycle = {},
    stats = {},
    eligibility = {},
    days = [],
  } = dashboardData || {};

  const ultimateReward = days.find((d) => d.dayNumber === 7);
  const currentRewardObj = days.find((d) => d.dayNumber === eligibility.currentDay) || days[0];

  return (
    <div className={styles.pageContainer}>
      {/* 1. Header */}
      <StreakHeader
        cycleNumber={cycle.cycleNumber || 1}
        currentStreak={cycle.currentStreak || 0}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* 2. Hero Banner */}
      <HeroBanner
        currentStreak={cycle.currentStreak || 0}
        currentDay={eligibility.currentDay || 1}
        canClaim={eligibility.canClaim}
        nextClaimAt={cycle.nextClaimAt}
        nextReward={currentRewardObj}
        onClaimClick={() => handleOpenClaim(currentRewardObj)}
        onCountdownExpire={handleCountdownExpire}
        isClaiming={isClaiming}
      />

      {/* Feature 1: Streak Freeze Shield Card */}
      <StreakFreezeCard
        hasFreeze={cycle.hasFreeze || eligibility.hasFreeze}
        onFreezePurchased={() => fetchDashboard(false)}
      />

      {/* 3. Statistics Bar */}
      <StreakStats stats={stats} />

      {/* 4. Ultimate Reward Banner (Day 7 highlight) */}
      <UltimateReward
        currentStreak={cycle.currentStreak || 0}
        ultimateReward={ultimateReward}
      />

      {/* 5. 7-Day Reward Grid */}
      <RewardGrid
        days={days}
        onClaim={handleOpenClaim}
        isClaiming={isClaiming}
      />

      {/* Feature 2: Rewards Redemption Store */}
      <RewardsStore onRedeemSuccess={() => fetchDashboard(false)} />

      {/* 6. Why Streak Section */}
      <WhyStreak />

      {/* 7. Platform Trust Footer */}
      <TrustFooter />

      {/* Claim & CPA Modal */}
      <ClaimModal
        reward={selectedRewardToClaim}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onClaimConfirmed={handleClaimConfirmed}
        isClaiming={isClaiming}
      />

      {/* Developer testing toolbar - strictly restricted to Admins */}
      {isAdmin && <DevControls onActionSuccess={() => fetchDashboard(false)} />}
    </div>
  );
};

export default DailyStreakPage;
