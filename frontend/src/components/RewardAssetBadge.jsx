import React from 'react';

/**
 * Authentic, high-fidelity visual assets for VELoop Daily Streak rewards.
 * Replaces generic placeholder Lucide icons with custom-crafted Amazon Gift Card
 * vouchers, 3D minted VELoop (VE) coins, and the Grand Finale Imperial Crown.
 */

// --- 1. Amazon Gift Card Voucher Asset ---
export const AmazonGiftCardAsset = ({ amount = '₹5', size = 'md', className = '' }) => {
  // Dimensions based on size
  const sizes = {
    sm: { width: 68, height: 44, rx: 6, logoSize: 9, amountSize: 11, chipW: 10, chipH: 8 },
    md: { width: 88, height: 56, rx: 8, logoSize: 11, amountSize: 13, chipW: 13, chipH: 10 },
    lg: { width: 130, height: 82, rx: 12, logoSize: 15, amountSize: 18, chipW: 18, chipH: 14 },
    xl: { width: 180, height: 114, rx: 16, logoSize: 20, amountSize: 24, chipW: 24, chipH: 18 },
  };

  const dim = sizes[size] || sizes.md;
  const cardId = `amz-card-${size}-${amount.replace(/[^\w]/g, '')}`;

  return (
    <div
      className={`amz-card-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 6px 14px rgba(0, 0, 0, 0.45)) drop-shadow(0 0 10px rgba(255, 153, 0, 0.25))',
      }}
    >
      <svg
        width={dim.width}
        height={dim.height}
        viewBox="0 0 160 102"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          {/* Card Body Gradient - Obsidian Matte with Luxury Gold/Amber Tint */}
          <linearGradient id={`${cardId}-bg`} x1="0" y1="0" x2="160" y2="102" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E232A" />
            <stop offset="45%" stopColor="#13171D" />
            <stop offset="100%" stopColor="#0B0D11" />
          </linearGradient>

          {/* Border Metallic Stroke */}
          <linearGradient id={`${cardId}-border`} x1="0" y1="0" x2="160" y2="102" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFD54F" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.9" />
          </linearGradient>

          {/* Chip Gold Gradient */}
          <linearGradient id={`${cardId}-chip`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="50%" stopColor="#FFB300" />
            <stop offset="100%" stopColor="#FF8F00" />
          </linearGradient>

          {/* Shimmer Light Reflection */}
          <linearGradient id={`${cardId}-shimmer`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
          </linearGradient>

          {/* Denomination Pill Gradient */}
          <linearGradient id={`${cardId}-pill`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Ambient Backglow */}
        <rect
          x="4"
          y="4"
          width="152"
          height="94"
          rx="12"
          fill="#FF9900"
          opacity="0.18"
          filter="blur(8px)"
        />

        {/* Card Base */}
        <rect
          x="2"
          y="2"
          width="156"
          height="98"
          rx="12"
          fill={`url(#${cardId}-bg)`}
          stroke={`url(#${cardId}-border)`}
          strokeWidth="1.5"
        />

        {/* Subtle Diagonal Hologram Stripe */}
        <path
          d="M 50 2 L 158 98 L 138 98 L 30 2 Z"
          fill="url(#amz-card-shimmer)"
          opacity="0.3"
        />

        {/* EMV Microchip Graphic */}
        <rect
          x="14"
          y="18"
          width="20"
          height="16"
          rx="3"
          fill={`url(#${cardId}-chip)`}
          stroke="#FFA000"
          strokeWidth="0.5"
        />
        <line x1="14" y1="26" x2="34" y2="26" stroke="#B45309" strokeWidth="0.6" opacity="0.7" />
        <line x1="24" y1="18" x2="24" y2="34" stroke="#B45309" strokeWidth="0.6" opacity="0.7" />
        <circle cx="24" cy="26" r="2.5" fill="#B45309" opacity="0.5" />

        {/* "amazon" Brand Wordmark & Official Smile Arrow */}
        <g transform="translate(14, 46)">
          {/* Authentic Amazon Typography */}
          <text
            x="0"
            y="18"
            fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
            fontSize="18"
            fontWeight="800"
            fill="#FFFFFF"
            letterSpacing="-0.5"
          >
            amazon
          </text>
          {/* GIFT CARD label */}
          <text
            x="76"
            y="17"
            fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
            fontSize="8"
            fontWeight="700"
            fill="#94A3B8"
            letterSpacing="1.2"
          >
            GIFT CARD
          </text>

          {/* Signature Amazon Smile Curve (Curves smoothly under amazon) */}
          <path
            d="M 3 24 Q 32 35 62 23"
            stroke="#FF9900"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Smile Arrow Head */}
          <path
            d="M 59 19 L 65 24 L 59 27 Z"
            fill="#FF9900"
          />
        </g>

        {/* Denomination Badge (Top Right) */}
        <g transform="translate(100, 14)">
          <rect
            x="0"
            y="0"
            width="46"
            height="22"
            rx="11"
            fill={`url(#${cardId}-pill)`}
            stroke="#FDE68A"
            strokeWidth="0.8"
          />
          <text
            x="23"
            y="15"
            fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
            fontSize="12"
            fontWeight="900"
            fill="#1E1B4B"
            textAnchor="middle"
          >
            {amount}
          </text>
        </g>

        {/* Bottom Security / Authenticity Bar */}
        <g transform="translate(14, 86)">
          <rect x="0" y="0" width="132" height="4" rx="2" fill="#2A303C" />
          <rect x="0" y="0" width="45" height="4" rx="2" fill="#FF9900" opacity="0.85" />
          <circle cx="126" cy="2" r="1.5" fill="#34D399" />
        </g>
      </svg>
    </div>
  );
};

// --- 2. 3D VELoop Virtual Currency Coin (VE) Asset ---
export const VECoinAsset = ({ count = 1, size = 'md', className = '' }) => {
  const sizes = {
    sm: { width: 44, height: 44 },
    md: { width: 56, height: 56 },
    lg: { width: 80, height: 80 },
    xl: { width: 104, height: 104 },
  };

  const dim = sizes[size] || sizes.md;

  // Single Minted 3D VE Coin SVG
  const renderSingleCoin = (cx = 36, cy = 36, r = 26, idPrefix = 've-coin') => (
    <g>
      {/* Outer Coin Drop Shadow */}
      <circle cx={cx} cy={cy + 3} r={r} fill="#1E0A3C" opacity="0.6" filter="blur(3px)" />

      {/* Coin Beveled Rim (Outer Gold Edge) */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={`url(#${idPrefix}-rim)`}
        stroke="#FDE68A"
        strokeWidth="1.2"
      />

      {/* Milled Edge Ribs */}
      <circle
        cx={cx}
        cy={cy}
        r={r - 3}
        fill="none"
        stroke="#B45309"
        strokeWidth="1"
        strokeDasharray="2.5 1.5"
        opacity="0.8"
      />

      {/* Coin Face (Recessed Center with Metallic Glow) */}
      <circle
        cx={cx}
        cy={cy}
        r={r - 4.5}
        fill={`url(#${idPrefix}-face)`}
      />

      {/* Inner Decorative Concentric Ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r - 6.5}
        fill="none"
        stroke="#DDD6FE"
        strokeWidth="0.8"
        strokeOpacity="0.4"
      />

      {/* 3D Embossed "VE" Monogram */}
      <g transform={`translate(${cx}, ${cy + 1})`}>
        {/* Shadow for 3D depth */}
        <text
          x="0"
          y="5.5"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize={r * 0.72}
          fontWeight="900"
          fill="#4C1D95"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          VE
        </text>
        {/* Front Embossed Lettering */}
        <text
          x="0"
          y="4.5"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize={r * 0.72}
          fontWeight="900"
          fill="#FFFFFF"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          VE
        </text>
      </g>

      {/* Top Specular Glint Highlight */}
      <path
        d={`M ${cx - r + 8} ${cy - 4} A ${r - 7} ${r - 7} 0 0 1 ${cx + r - 8} ${cy - 4}`}
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.65"
      />
    </g>
  );

  return (
    <div
      className={`ve-coin-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 6px 14px rgba(139, 92, 246, 0.45)) drop-shadow(0 0 8px rgba(245, 158, 11, 0.3))',
      }}
    >
      <svg
        width={dim.width}
        height={dim.height}
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          {/* Rim Gradient - Rich Gold with Metallic Transition */}
          <linearGradient id="ve-coin-rim" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>

          {/* Coin Face - Royal Violet & Gold Specular Radial Gradient */}
          <radialGradient id="ve-coin-face" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="45%" stopColor="#7C3AED" />
            <stop offset="85%" stopColor="#4C1D95" />
            <stop offset="100%" stopColor="#2E1065" />
          </radialGradient>

          {/* Cyan Booster Glow for Day 6 */}
          <radialGradient id="ve-coin-cyan" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0E7490" />
          </radialGradient>
        </defs>

        {/* Ambient Radial Energy Aura */}
        <circle cx="36" cy="36" r="32" fill="#8B5CF6" opacity="0.22" filter="blur(8px)" />

        {count === 1 && renderSingleCoin(36, 36, 26, 've-coin')}

        {count === 2 && (
          <g>
            {/* Back Coin */}
            {renderSingleCoin(28, 30, 22, 've-coin')}
            {/* Front Coin */}
            {renderSingleCoin(44, 42, 24, 've-coin')}
          </g>
        )}

        {count === 3 && (
          <g>
            {/* Top Coin */}
            {renderSingleCoin(36, 22, 19, 've-coin')}
            {/* Bottom Left Coin */}
            {renderSingleCoin(24, 46, 21, 've-coin')}
            {/* Bottom Right Coin */}
            {renderSingleCoin(48, 46, 21, 've-coin')}
          </g>
        )}

        {count >= 30 && (
          <g>
            {/* Epic Mega Booster Stack (Day 6) */}
            {/* Cyan Aura Blast */}
            <circle cx="36" cy="36" r="34" fill="#06B6D4" opacity="0.3" filter="blur(8px)" />
            {/* Base Coin 1 */}
            {renderSingleCoin(24, 46, 18, 've-coin')}
            {/* Base Coin 2 */}
            {renderSingleCoin(48, 46, 18, 've-coin')}
            {/* Mid Coin */}
            {renderSingleCoin(36, 32, 21, 've-coin')}
            {/* Top Coin */}
            {renderSingleCoin(36, 18, 17, 've-coin')}
            {/* Mega "+30" Crystal Pill */}
            <g transform="translate(16, 50)">
              <rect x="0" y="0" width="40" height="18" rx="9" fill="#0891B2" stroke="#A5F3FC" strokeWidth="1" />
              <text x="20" y="13" fontFamily="sans-serif" fontSize="10" fontWeight="900" fill="#FFFFFF" textAnchor="middle">
                +30 VE
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

// --- 3. Grand Finale Ultimate Royal Crown & Trophy Asset (Day 7) ---
export const UltimateCrownAsset = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: { width: 56, height: 56 },
    md: { width: 76, height: 76 },
    lg: { width: 110, height: 110 },
    xl: { width: 140, height: 140 },
  };

  const dim = sizes[size] || sizes.md;

  return (
    <div
      className={`ultimate-crown-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 8px 24px rgba(245, 158, 11, 0.55)) drop-shadow(0 0 16px rgba(251, 191, 36, 0.4))',
      }}
    >
      <svg
        width={dim.width}
        height={dim.height}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          {/* Imperial Gold Gradient */}
          <linearGradient id="crown-gold-primary" x1="0" y1="20" x2="120" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="25%" stopColor="#FDE68A" />
            <stop offset="55%" stopColor="#F59E0B" />
            <stop offset="85%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Velvet Cushion Radial Interior */}
          <radialGradient id="crown-velvet" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="60%" stopColor="#4C1D95" />
            <stop offset="100%" stopColor="#2E1065" />
          </radialGradient>

          {/* Ruby Gemstone Gradient */}
          <radialGradient id="gem-ruby" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FCA5A5" />
            <stop offset="50%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </radialGradient>

          {/* Sapphire Gemstone Gradient */}
          <radialGradient id="gem-sapphire" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </radialGradient>

          {/* Emerald Gemstone Gradient */}
          <radialGradient id="gem-emerald" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#065F46" />
          </radialGradient>

          {/* Golden Aura Glow */}
          <radialGradient id="crown-aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Rotating Sunburst Rays */}
        <circle cx="60" cy="60" r="54" fill="url(#crown-aura)" />

        {/* Sparkle Glint Cross Stars */}
        <g opacity="0.85">
          <path d="M 60 4 L 62 14 L 72 16 L 62 18 L 60 28 L 58 18 L 48 16 L 58 14 Z" fill="#FDE68A" />
          <path d="M 18 36 L 19 42 L 25 43 L 19 44 L 18 50 L 17 44 L 11 43 L 17 42 Z" fill="#FDE68A" opacity="0.7" />
          <path d="M 102 36 L 103 42 L 109 43 L 103 44 L 102 50 L 101 44 L 95 43 L 101 42 Z" fill="#FDE68A" opacity="0.7" />
        </g>

        {/* Imperial Velvet Cushion Interior (Back) */}
        <path
          d="M 28 72 C 28 42, 92 42, 92 72 Z"
          fill="url(#crown-velvet)"
          opacity="0.9"
        />

        {/* Crown Main Body - 5 Sculpted Regal Peaks */}
        <path
          d="M 20 74 
             L 22 42 
             L 38 56 
             L 60 28 
             L 82 56 
             L 98 42 
             L 100 74 
             Z"
          fill="url(#crown-gold-primary)"
          stroke="#FFFBEB"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Peak Spheres (Pearls on top of each peak) */}
        <circle cx="22" cy="40" r="4.5" fill="#FFFBEB" stroke="#D97706" strokeWidth="1" />
        <circle cx="38" cy="54" r="3.5" fill="#FFFBEB" stroke="#D97706" strokeWidth="1" />
        <circle cx="60" cy="26" r="6" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.2" />
        <circle cx="82" cy="54" r="3.5" fill="#FFFBEB" stroke="#D97706" strokeWidth="1" />
        <circle cx="98" cy="40" r="4.5" fill="#FFFBEB" stroke="#D97706" strokeWidth="1" />

        {/* Center Cross on the tallest peak */}
        <path
          d="M 60 14 L 60 22 M 56 18 L 64 18"
          stroke="#FDE68A"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Crown Circlet Base (Filigree Headband) */}
        <rect
          x="16"
          y="72"
          width="88"
          height="18"
          rx="6"
          fill="url(#crown-gold-primary)"
          stroke="#FDE68A"
          strokeWidth="1.2"
        />

        {/* Inset Precious Gemstones along the headband */}
        <circle cx="28" cy="81" r="4.5" fill="url(#gem-sapphire)" stroke="#1E3A8A" strokeWidth="0.8" />
        <circle cx="44" cy="81" r="4" fill="url(#gem-emerald)" stroke="#065F46" strokeWidth="0.8" />
        {/* Large Central Ruby */}
        <ellipse cx="60" cy="81" rx="6" ry="5.5" fill="url(#gem-ruby)" stroke="#7F1D1D" strokeWidth="1" />
        <circle cx="76" cy="81" r="4" fill="url(#gem-emerald)" stroke="#065F46" strokeWidth="0.8" />
        <circle cx="92" cy="81" r="4.5" fill="url(#gem-sapphire)" stroke="#1E3A8A" strokeWidth="0.8" />

        {/* Center Peak Oval Ruby Inset */}
        <ellipse cx="60" cy="46" rx="4.5" ry="5" fill="url(#gem-ruby)" stroke="#991B1B" strokeWidth="0.8" />

        {/* Miniature Floating Amazon ₹5 Voucher Badge (Underneath Crown) */}
        <g transform="translate(24, 92)">
          <rect
            x="0"
            y="0"
            width="72"
            height="22"
            rx="5"
            fill="#131921"
            stroke="#FF9900"
            strokeWidth="1.2"
          />
          <text
            x="8"
            y="14"
            fontFamily="sans-serif"
            fontSize="8"
            fontWeight="800"
            fill="#FFFFFF"
          >
            amazon
          </text>
          <path d="M 9 17 Q 20 22 31 16" stroke="#FF9900" strokeWidth="1.2" fill="none" />
          <rect x="42" y="3" width="26" height="16" rx="4" fill="#F59E0B" />
          <text
            x="55"
            y="14"
            fontFamily="sans-serif"
            fontSize="9"
            fontWeight="900"
            fill="#1E1B4B"
            textAnchor="middle"
          >
            ₹5
          </text>
        </g>
      </svg>
    </div>
  );
};

// --- 4. Main Component: Universal Reward Asset Router ---
export const RewardAssetBadge = ({ dayNumber, reward, size = 'md', className = '' }) => {
  const day = dayNumber || (reward && reward.dayNumber) || 1;
  const rewardType = reward?.rewardType || '';
  const title = reward?.title || '';

  // Day 7: The Ultimate Grand Prize (Crown + Amazon ₹5 Voucher)
  if (day === 7 || reward?.isUltimateReward) {
    return <UltimateCrownAsset size={size} className={className} />;
  }

  // Days 4 & 5: Amazon Gift Cards (or any Amazon voucher reward)
  if (day === 4 || (rewardType === 'AMAZON_GIFT_CARD' && (title.includes('₹1') || day === 4))) {
    return <AmazonGiftCardAsset amount="₹1" size={size} className={className} />;
  }

  if (day === 5 || (rewardType === 'AMAZON_GIFT_CARD' && (title.includes('₹2') || day === 5))) {
    return <AmazonGiftCardAsset amount="₹2" size={size} className={className} />;
  }

  // Generic Amazon Gift Card fallback if amount differs
  if (rewardType === 'AMAZON_GIFT_CARD') {
    const match = title.match(/₹\d+/);
    const amt = match ? match[0] : '₹5';
    return <AmazonGiftCardAsset amount={amt} size={size} className={className} />;
  }

  // VE Currency Days:
  if (day === 1) {
    return <VECoinAsset count={1} size={size} className={className} />;
  }
  if (day === 2) {
    return <VECoinAsset count={2} size={size} className={className} />;
  }
  if (day === 3) {
    return <VECoinAsset count={3} size={size} className={className} />;
  }
  if (day === 6) {
    // Mega Booster Stack (+30 VEs)
    return <VECoinAsset count={30} size={size} className={className} />;
  }

  // Default fallback: Single VE Coin
  return <VECoinAsset count={1} size={size} className={className} />;
};

export default RewardAssetBadge;
