import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Gift, X, CheckCircle2, Copy, Check, Sparkles, AlertCircle } from 'lucide-react';
import CpaDemo from './CpaDemo';
import styles from '../pages/DailyStreak/DailyStreak.module.css';

const ClaimModal = ({ reward, isOpen, onClose, onClaimConfirmed, isClaiming }) => {
  const [step, setStep] = useState('confirm'); // 'confirm' | 'cpa' | 'success'
  const [claimResult, setClaimResult] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !reward) return null;

  // Trigger celebration confetti
  const triggerConfetti = (isUltimate = false) => {
    confetti({
      particleCount: isUltimate ? 180 : 100,
      spread: isUltimate ? 100 : 70,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#F59E0B', '#10B981', '#FBBF24', '#DDD6FE'],
    });
  };

  const handleStartClaim = () => {
    setStep('cpa');
  };

  const handleCpaComplete = async (cpaToken) => {
    try {
      setErrorMessage('');
      const result = await onClaimConfirmed({
        cpaToken,
        cpaEngagementSeconds: 3,
      });

      setClaimResult(result);
      setStep('success');
      triggerConfetti(reward.isUltimateReward);
    } catch (err) {
      setErrorMessage(err.message || 'Claim failed. Please try again.');
      setStep('confirm');
    }
  };

  const handleCopyVoucher = (code) => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleClose = () => {
    setStep('confirm');
    setClaimResult(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalCloseBtn} onClick={handleClose} disabled={isClaiming}>
          <X size={18} />
        </button>

        {/* STEP 1: Confirm Claim */}
        {step === 'confirm' && (
          <div>
            <div className={styles.modalHeader}>
              <div className={styles.modalIconCircle}>
                <Gift size={36} />
              </div>
              <h2 className={styles.modalTitle}>Claim Day {reward.dayNumber} Reward</h2>
              <p className={styles.modalSubtitle}>
                Unlock your daily reward and maintain your streak momentum
              </p>
            </div>

            {errorMessage && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '12px',
                  padding: '0.85rem',
                  color: '#F87171',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className={styles.rewardRevealBox}>
              <div className={styles.revealValue}>{reward.title}</div>
              <div className={styles.revealTitle}>
                {reward.rewardType === 'AMAZON_GIFT_CARD'
                  ? 'Real Amazon Gift Card Voucher'
                  : 'VELoop Virtual Coins'}
              </div>
            </div>

            <button
              onClick={handleStartClaim}
              className={styles.claimHeroBtn}
              style={{ width: '100%', padding: '0.9rem' }}
            >
              <Sparkles size={18} />
              <span>Verify & Claim Reward</span>
            </button>
          </div>
        )}

        {/* STEP 2: CPA Demo Verification */}
        {step === 'cpa' && (
          <div>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Daily Activity Verification</h2>
              <p className={styles.modalSubtitle}>Please hold while we verify your check-in</p>
            </div>

            <CpaDemo onComplete={handleCpaComplete} onCancel={() => setStep('confirm')} />
          </div>
        )}

        {/* STEP 3: Success Reveal */}
        {step === 'success' && claimResult && (
          <div style={{ textAlign: 'center' }}>
            <div
              className={styles.modalIconCircle}
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.6)',
              }}
            >
              <CheckCircle2 size={40} />
            </div>

            <h2 className={styles.modalTitle} style={{ color: '#34D399' }}>
              Reward Claimed!
            </h2>
            <p className={styles.modalSubtitle}>
              {claimResult.message || 'Your reward has been credited to your VELoop Wallet.'}
            </p>

            <div className={styles.rewardRevealBox} style={{ margin: '1.5rem 0' }}>
              <div className={styles.revealValue} style={{ color: '#FBBF24' }}>
                {claimResult.claimedReward?.title}
              </div>

              {/* If Amazon Gift Card was awarded, display code */}
              {claimResult.claimedReward?.giftCardCode && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>
                    Your Amazon Voucher Code:
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      marginTop: '0.4rem',
                      background: 'rgba(245, 158, 11, 0.15)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '10px',
                      border: '1px dashed #F59E0B',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: '#FBBF24',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {claimResult.claimedReward.giftCardCode}
                    </span>
                    <button
                      onClick={() => handleCopyVoucher(claimResult.claimedReward.giftCardCode)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#DDD6FE',
                        cursor: 'pointer',
                        padding: '2px',
                      }}
                      title="Copy voucher code"
                    >
                      {copiedCode ? <Check size={16} color="#34D399" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleClose}
              className={styles.claimHeroBtn}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              }}
            >
              Done & Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimModal;
