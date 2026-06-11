'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '@/lib/apiConfig';

const SettingsContext = createContext(null);

const CACHE_KEY = 'unientry_settings_cache';

const defaultSettings = {
  whatsappNumber: '919876543210',
  phone: '+91 98765 43210',
  email: 'info@unientry.com',
  address: 'UniEntry Education Consultancy',
  socialLinks: { facebook: '', instagram: '', twitter: '', linkedin: '', youtube: '' },
  heroTitle: 'Built to Simplify Student Life',
  heroSubtitle: 'Simplify Student Life By Solving Real Problems',
  aboutText: 'UniEntry is a trusted educational consultancy helping students achieve their dream of studying at top universities worldwide.',
  founderName: 'Darshan',
  founderRole: 'Founder & CEO',
  founderMessage: 'Education is the passport to the future, for tomorrow belongs to those who prepare for it today.',
  founderImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800'
};

/**
 * Reads cached settings from localStorage.
 * Returns cached data if valid, otherwise returns defaultSettings.
 */
function getCachedSettings() {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Use cached data merged with defaults (in case new fields are added)
      return { ...defaultSettings, ...parsed };
    }
  } catch {
    // localStorage not available or corrupt — ignore
  }
  return defaultSettings;
}

export function SettingsProvider({ children }) {
  // Initialize from cache immediately — no flash
  const [settings, setSettings] = useState(defaultSettings);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Step 1: Immediately load from localStorage (sync, instant)
    const cached = getCachedSettings();
    setSettings(cached);
    setInitialized(true);

    // Step 2: Fetch fresh data from API in background
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/settings`, {
          cache: 'no-store',
          headers: { 'Accept': 'application/json' },
          mode: 'cors',
          signal: AbortSignal.timeout(5000),
        });
        const data = await res.json();
        if (data.success && data.data) {
          const fresh = { ...defaultSettings, ...data.data };
          setSettings(fresh);
          // Save to localStorage for next visit
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(data.data));
          } catch {
            // Storage full or not available — ignore
          }
        }
      } catch {
        // Server down — keep using cached/default settings silently
      }
    };
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
