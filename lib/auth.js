'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('unientry_token');
      if (token) {
        const res = await authAPI.getMe();
        setAdmin(res.data.admin);
      }
    } catch (error) {
      localStorage.removeItem('unientry_token');
      localStorage.removeItem('unientry_admin');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      localStorage.setItem('unientry_token', res.data.token);
      localStorage.setItem('unientry_admin', JSON.stringify(res.data.admin));
      setAdmin(res.data.admin);
      return res.data;
    }
    throw new Error(res.data.message);
  };

  const logout = () => {
    localStorage.removeItem('unientry_token');
    localStorage.removeItem('unientry_admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
