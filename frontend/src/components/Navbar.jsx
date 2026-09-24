import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Flame, Wallet, History, User, LogOut, Menu, X, Coins, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, walletSummary, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.5rem 0.85rem',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: isActive ? '#FFFFFF' : '#94A3B8',
    background: isActive ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
    border: isActive ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
    transition: 'all 0.2s ease',
  });

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 8000,
        background: 'rgba(10, 6, 24, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #F59E0B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--primary-glow)',
            }}
          >
            <Flame size={24} color="#FFFFFF" />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              VELoop <span style={{ color: '#FBBF24' }}>Rewards</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#A78BFA', letterSpacing: '0.05em' }}>
              DAILY STREAK SYSTEM
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links (if authenticated) */}
        {isAuthenticated ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            className="d-none d-md-flex"
          >
            <NavLink to="/" style={navLinkStyle} end>
              <Flame size={18} color="#F59E0B" />
              <span>Daily Streak</span>
            </NavLink>

            <NavLink to="/wallet" style={navLinkStyle}>
              <Wallet size={18} color="#34D399" />
              <span>Wallet</span>
            </NavLink>

            <NavLink to="/history" style={navLinkStyle}>
              <History size={18} color="#A78BFA" />
              <span>History</span>
            </NavLink>

            <NavLink to="/profile" style={navLinkStyle}>
              <User size={18} color="#60A5FA" />
              <span>Profile</span>
            </NavLink>
          </div>
        ) : null}

        {/* Right side: Wallet Balances & User Profile (or Login buttons) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <>
              {/* VE Balance Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.75rem',
                  background: 'rgba(124, 58, 237, 0.18)',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  borderRadius: '20px',
                  color: '#DDD6FE',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
                title="VE Coins Balance"
              >
                <Coins size={16} color="#A78BFA" />
                <span>{walletSummary?.veBalance ?? 0} VEs</span>
              </div>

              {/* Amazon Gift Card Total Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.75rem',
                  background: 'rgba(245, 158, 11, 0.18)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '20px',
                  color: '#FDE68A',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
                className="d-none d-sm-flex"
                title="Total Amazon Gift Cards Earned"
              >
                <Gift size={16} color="#FBBF24" />
                <span>₹{walletSummary?.totalAmazonEarned ?? 0}</span>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: '#94A3B8',
                  padding: '0.45rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Logout"
              >
                <LogOut size={16} />
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="d-md-none"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '0.4rem',
                  cursor: 'pointer',
                }}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to="/login"
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  color: '#DDD6FE',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: 'var(--primary-glow)',
                }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && isAuthenticated && (
        <div
          className="d-md-none"
          style={{
            background: 'rgba(13, 7, 33, 0.98)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <NavLink
            to="/"
            style={navLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
            end
          >
            <Flame size={18} color="#F59E0B" />
            <span>Daily Streak Dashboard</span>
          </NavLink>
          <NavLink
            to="/wallet"
            style={navLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Wallet size={18} color="#34D399" />
            <span>Wallet & Vouchers</span>
          </NavLink>
          <NavLink
            to="/history"
            style={navLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
          >
            <History size={18} color="#A78BFA" />
            <span>Reward Claim History</span>
          </NavLink>
          <NavLink
            to="/profile"
            style={navLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
          >
            <User size={18} color="#60A5FA" />
            <span>My Profile</span>
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
