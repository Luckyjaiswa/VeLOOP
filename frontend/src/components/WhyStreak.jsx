import React from 'react';
import { CalendarCheck, ShieldCheck, Trophy } from 'lucide-react';
import styles from '../pages/DailyStreak/DailyStreak.module.css';

const WhyStreak = () => {
  return (
    <div className={styles.whySection}>
      <div className={styles.whyHeader}>
        <h3>Why Maintain Your Daily Streak?</h3>
        <p>
          Consistency pays off on VELoop. Every day you return, the rewards compound until you unlock real Amazon Gift Cards!
        </p>
      </div>

      <div className={styles.whyGrid}>
        <div className={styles.whyCard}>
          <div className={styles.whyIcon}>
            <CalendarCheck size={22} />
          </div>
          <h4>Daily Consecutive Check-In</h4>
          <p>
            Log in every 24 hours to claim that day’s reward. Skipping a day resets your streak to Day 1, so keep the flame burning!
          </p>
        </div>

        <div className={styles.whyCard}>
          <div className={styles.whyIcon}>
            <Trophy size={22} />
          </div>
          <h4>Amazon Gift Card Vouchers</h4>
          <p>
            On Days 4, 5, and 7, earn direct Amazon digital gift card voucher codes deposited immediately into your VELoop wallet.
          </p>
        </div>

        <div className={styles.whyCard}>
          <div className={styles.whyIcon}>
            <ShieldCheck size={22} />
          </div>
          <h4>Guaranteed & Tamper-Proof</h4>
          <p>
            All streak claims are verified and protected on our secure backend. No client-clock exploits or false claims possible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhyStreak;
