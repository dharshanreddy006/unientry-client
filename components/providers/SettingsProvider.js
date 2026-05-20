'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '@/lib/apiConfig';

const SettingsContext = createContext(null);

const defaultSettings = {
  whatsappNumber: '919876543210',
  phone: '+91 98765 43210',
  email: 'info@unientry.com',
  address: 'UniEntry Education Consultancy',
  socialLinks: { facebook: '', instagram: '', twitter: '', linkedin: '', youtube: '' },
  heroTitle: 'Your Gateway to Global Education',
  heroSubtitle: 'Discover top universities worldwide. Get expert guidance for admissions, visas, and scholarships.',
  aboutText: 'UniEntry is a trusted educational consultancy helping students achieve their dream of studying at top universities worldwide.',
  founderName: 'Darshan',
  founderRole: 'Founder & CEO',
  founderMessage: 'Education is the passport to the future, for tomorrow belongs to those who prepare for it today.',
  founderImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800'
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/settings`, {
          cache: 'no-store',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors',
          signal: AbortSignal.timeout(3000), // Fail fast if server is down
        });
        const data = await res.json();
        if (data.success && data.data) {
          setSettings({ ...defaultSettings, ...data.data });
        }
      } catch (err) {
        // Silently fall back to defaults — no console noise
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

