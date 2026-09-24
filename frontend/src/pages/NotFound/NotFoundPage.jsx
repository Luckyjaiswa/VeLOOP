import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 140px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div
        style={{
          width: '84px',
          height: '84px',
          borderRadius: '24px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)',
        }}
      >
        <Flame size={44} color="#F87171" />
      </div>

      <h1
        style={{
          fontSize: '4.5rem',
          fontWeight: 900,
          fontFamily: 'var(--font-heading)',
          color: '#FFFFFF',
          margin: 0,
          lineHeight: 1,
        }}
      >
        404
      </h1>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#C4B5FD', marginTop: '0.5rem' }}>
        Streak Lost in Orbit
      </h2>

      <p style={{ color: '#94A3B8', maxWidth: '420px', margin: '0.75rem auto 2rem auto', fontSize: '0.95rem' }}>
        The page you are looking for does not exist on the VELoop Rewards network. Don't worry, your daily streak is still safe!
      </p>

      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.85rem 1.75rem',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
          color: '#FFFFFF',
          fontSize: '0.95rem',
          fontWeight: 700,
          textDecoration: 'none',
          boxShadow: 'var(--primary-glow)',
        }}
      >
        <Home size={18} />
        <span>Return to Daily Streak</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
