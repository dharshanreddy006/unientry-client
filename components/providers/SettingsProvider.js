'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

export function SettingsProvider({ children, initialSettings }) {
  const [settings, setSettings] = useState(initialSettings);

  // Fallback default values in case fetch fails
  const defaultSettings = {
    whatsappNumber: '919876543210',
    phone: '+91 98765 43210',
    email: 'info@unientry.com',
    address: 'UniEntry Education Consultancy',
    socialLinks: { facebook: '', instagram: '', twitter: '', linkedin: '', youtube: '' },
    founderName: 'Dr. Jane Smith',
    founderRole: 'Founder & CEO',
    founderMessage: 'Education is the passport to the future, for tomorrow belongs to those who prepare for it today.',
    founderImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800'
  };

  const currentSettings = settings || defaultSettings;

  return (
    <SettingsContext.Provider value={currentSettings}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
