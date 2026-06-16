'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_URL } from '@/lib/apiConfig';

const AuthContext = createContext(null);

const AUTH_KEY = 'unientry_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.token && parsed.user) {
          setUser(parsed.user);
          setToken(parsed.token);
        }
      }
    } catch (e) {
      localStorage.removeItem(AUTH_KEY);
    }
    setLoading(false);
  }, []);

  const saveAuth = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user: userData, token: authToken }));
  };

  const login = useCallback(async (identifier, password) => {
    const res = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    saveAuth(data.data, data.data.token);
    return data.data;
  }, []);

  const signup = useCallback(async (name, email, phone, password, role) => {
    const res = await fetch(`${API_URL}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email: email || undefined, phone: phone || undefined, password, role }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    saveAuth(data.data, data.data.token);
    return data.data;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  const loginWithGoogle = useCallback(async (role = 'student') => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

      // Simulation mode if key is missing or dummy
      if (!apiKey || apiKey === 'AIzaSyDummyApiKeyPlaceholderForOAuth') {
        console.warn("Using simulated Google Sign-In because no valid Firebase API key is set in .env.local.");
        
        // Simulating loading state delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        const res = await fetch(`${API_URL}/users/google-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            googleId: 'google_mock_user_123456789',
            name: 'Demo Google User',
            email: 'demo_user@google.com',
            profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
            role,
          }),
        });
        
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        saveAuth(data.data, data.data.token);
        return data.data;
      }

      // Real Firebase authentication
      const { auth, googleProvider, signInWithPopup } = await import('@/lib/firebase');
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      const res = await fetch(`${API_URL}/users/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleId: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          profilePicture: firebaseUser.photoURL,
          role,
        }),
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      saveAuth(data.data, data.data.token);
      return data.data;
    } catch (err) {
      if (err.code === 'auth/api-key-not-valid' || err.message?.includes('API_KEY_INVALID') || err.message?.includes('api-key-not-valid')) {
        throw new Error('Google Auth not configured. Please add NEXT_PUBLIC_FIREBASE_API_KEY to client/.env.local');
      }
      throw err;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, loginWithGoogle, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
