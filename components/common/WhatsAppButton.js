'use client';

import { useSettings } from '@/components/providers/SettingsProvider';

export default function WhatsAppButton({ text, className, children }) {
  const settings = useSettings();
  const defaultText = text || 'Hi UniEntry! I need admission guidance.';
  const href = `https://wa.me/${settings?.whatsappNumber}?text=${encodeURIComponent(defaultText)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
