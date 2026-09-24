import React from 'react';
import { Flame } from 'lucide-react';

const StreakLoader = ({ message = 'Synchronizing daily streak state...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        width: '100%',
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #7C3AED 0%, #F59E0B 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulseGlow 2s infinite',
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)',
        }}
      >
        <Flame size={36} color="#FFFFFF" />
      </div>
      <div
        style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: '#DDD6FE',
          letterSpacing: '0.02em',
        }}
      >
        {message}
      </div>
    </div>
  );
};

export default StreakLoader;
