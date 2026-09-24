import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../services/streakApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [walletSummary, setWalletSummary] = useState({ veBalance: 0, totalAmazonEarned: 0 });
  const [token, setToken] = useState(localStorage.getItem('veloop_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('veloop_token');
      if (storedToken) {
        try {
          const res = await getCurrentUser();
          if (res.success && res.user) {
            setUser(res.user);
            if (res.wallet) {
              setWalletSummary(res.wallet);
            }
          } else {
            logout();
          }
        } catch (err) {
          console.warn('[Auth] Session check failed, clearing token');
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('veloop_token', res.token);
      setToken(res.token);
      setUser(res.user);
      if (res.wallet) {
        setWalletSummary(res.wallet);
      }
      return res;
    }
    throw new Error(res.message || 'Failed to sign in');
  };

  const register = async (name, email, password) => {
    const res = await registerUser({ name, email, password });
    if (res.success && res.token) {
      localStorage.setItem('veloop_token', res.token);
      setToken(res.token);
      setUser(res.user);
      if (res.wallet) {
        setWalletSummary(res.wallet);
      }
      return res;
    }
    throw new Error(res.message || 'Failed to create account');
  };

  const logout = async () => {
    try {
      if (token) {
        await logoutUser().catch(() => {});
      }
    } finally {
      localStorage.removeItem('veloop_token');
      setToken(null);
      setUser(null);
      setWalletSummary({ veBalance: 0, totalAmazonEarned: 0 });
    }
  };

  const updateWalletSummary = (newWallet) => {
    setWalletSummary((prev) => ({
      ...prev,
      ...newWallet,
    }));
  };

  const refreshUser = async () => {
    try {
      const res = await getCurrentUser();
      if (res.success && res.user) {
        setUser(res.user);
        if (res.wallet) {
          setWalletSummary(res.wallet);
        }
      }
    } catch (err) {
      console.error('[Auth] Refresh user error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        walletSummary,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        updateWalletSummary,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
