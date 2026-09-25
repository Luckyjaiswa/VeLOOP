import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, Gift, ShoppingBag, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';

/**
 * Helper to mask a voucher code while retaining brand prefix and suffix:
 * e.g., AMZN-9F4K-28LA-Q812 -> AMZN-••••-••••-Q812
 */
export const maskVoucherCode = (code) => {
  if (!code || typeof code !== 'string') return '••••-••••-••••-••••';
  const parts = code.split('-');
  if (parts.length >= 4) {
    return `${parts[0]}-••••-••••-${parts[parts.length - 1]}`;
  } else if (parts.length === 3) {
    return `${parts[0]}-••••-${parts[2]}`;
  } else if (code.length >= 12) {
    const prefix = code.slice(0, 4);
    const suffix = code.slice(-4);
    return `${prefix}-••••-••••-${suffix}`;
  }
  return code.slice(0, 3) + '••••••' + code.slice(-2);
};

const VoucherCard = ({ voucher, onRedeem, isRedeeming = false }) => {
  const [isMasked, setIsMasked] = useState(true);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  if (!voucher) return null;

  const brand = voucher.brand || 'Amazon Pay';
  const isAmazon = brand.toLowerCase().includes('amazon');
  const isGoogle = brand.toLowerCase().includes('google') || brand.toLowerCase().includes('play');
  const isFlipkart = brand.toLowerCase().includes('flipkart');

  let brandColor = '#F59E0B';
  let brandGlow = 'rgba(245, 158, 11, 0.4)';
  let brandBg = 'rgba(245, 158, 11, 0.15)';

  if (isGoogle) {
    brandColor = '#10B981';
    brandGlow = 'rgba(16, 185, 129, 0.4)';
    brandBg = 'rgba(16, 185, 129, 0.15)';
  } else if (isFlipkart) {
    brandColor = '#3B82F6';
    brandGlow = 'rgba(59, 130, 246, 0.4)';
    brandBg = 'rgba(59, 130, 246, 0.15)';
  }

  const handleCopy = (e) => {
    e.stopPropagation();
    // Always copy the RAW unmasked code
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    showToast(`Voucher code ${voucher.code} copied to clipboard!`, 'info');
    setTimeout(() => setCopied(false), 2200);
  };

  const toggleMask = (e) => {
    e.stopPropagation();
    setIsMasked((prev) => !prev);
  };

  const isRedeemed = Boolean(voucher.isRedeemed);

  return (
    <div
      style={{
        background: isRedeemed
          ? 'rgba(18, 12, 38, 0.7)'
          : 'linear-gradient(135deg, rgba(23, 14, 56, 0.95) 0%, rgba(35, 18, 80, 0.95) 100%)',
        border: isRedeemed
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : `1px solid ${brandColor}66`,
        borderRadius: '18px',
        padding: '1.35rem',
        boxShadow: isRedeemed ? 'none' : `0 4px 20px ${brandGlow}`,
        opacity: isRedeemed ? 0.72 : 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        transition: 'all 0.25s ease',
        position: 'relative',
      }}
    >
      {/* Card Header: Brand, Amount, Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '8px',
              background: brandBg,
              color: brandColor,
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '0.4rem',
            }}
          >
            <Gift size={13} color={brandColor} />
            <span>{brand}</span>
          </div>

          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1 }}>
            ₹{voucher.amount}{' '}
            <span style={{ fontSize: '0.85rem', color: brandColor, fontWeight: 600 }}>
              {voucher.currency || 'INR'}
            </span>
          </div>
        </div>

        {/* Status Pill */}
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '0.25rem 0.65rem',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: isRedeemed ? 'rgba(255, 255, 255, 0.08)' : 'rgba(16, 185, 129, 0.2)',
            border: isRedeemed ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #10B981',
            color: isRedeemed ? '#94A3B8' : '#34D399',
          }}
        >
          {isRedeemed ? (
            <>
              <CheckCircle2 size={12} />
              <span>Redeemed</span>
            </>
          ) : (
            <>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#10B981',
                  boxShadow: '0 0 6px #10B981',
                }}
              />
              <span>Ready to Use</span>
            </>
          )}
        </span>
      </div>

      {/* Masked Voucher Code Box */}
      <div
        style={{
          background: 'rgba(10, 6, 24, 0.85)',
          padding: '0.75rem 0.95rem',
          borderRadius: '12px',
          border: '1px dashed rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
        }}
      >
        {/* Code display: masked or unmasked */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
            Voucher Code {isMasked ? '(Masked)' : '(Revealed)'}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem',
              fontWeight: 800,
              color: isMasked ? '#CBD5E1' : '#FDE68A',
              letterSpacing: isMasked ? '0.05em' : '0.08em',
              transition: 'color 0.2s ease',
            }}
          >
            {isMasked ? maskVoucherCode(voucher.code) : voucher.code}
          </span>
        </div>

        {/* Action Buttons: Toggle Mask & Copy */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {/* Eye Toggle button */}
          <button
            onClick={toggleMask}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '0.45rem',
              color: isMasked ? '#94A3B8' : '#FBBF24',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            title={isMasked ? 'Reveal raw voucher code' : 'Mask voucher code'}
          >
            {isMasked ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            style={{
              background: copied ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.2)',
              border: copied ? '1px solid #10B981' : '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '8px',
              padding: '0.45rem 0.75rem',
              color: copied ? '#34D399' : '#FDE68A',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.2s ease',
            }}
            title="Copy raw unmasked voucher code"
          >
            {copied ? <Check size={14} color="#34D399" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Meta Footer: PIN & Date */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.78rem',
          color: '#94A3B8',
          paddingTop: '0.2rem',
        }}
      >
        <span>Claimed: {formatDate(voucher.claimedAt || new Date())}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={14} color="#A78BFA" />
          <span>
            PIN: <strong style={{ color: '#DDD6FE', fontFamily: 'var(--font-mono)' }}>{voucher.pin || '7829'}</strong>
          </span>
        </div>
      </div>

      {/* Mark as Redeemed Action button */}
      {!isRedeemed && onRedeem && (
        <button
          onClick={() => onRedeem(voucher._id || voucher.id)}
          disabled={isRedeeming}
          style={{
            marginTop: '0.25rem',
            padding: '0.55rem',
            borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            color: '#FDE68A',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: isRedeeming ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!isRedeeming) e.currentTarget.style.background = 'rgba(245, 158, 11, 0.25)';
          }}
          onMouseLeave={(e) => {
            if (!isRedeeming) e.currentTarget.style.background = 'rgba(245, 158, 11, 0.15)';
          }}
        >
          {isRedeeming ? 'Updating Status...' : 'Mark as Redeemed'}
        </button>
      )}
    </div>
  );
};

export default VoucherCard;
