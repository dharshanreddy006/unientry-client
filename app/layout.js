import { SettingsProvider } from '@/components/providers/SettingsProvider';
import "./globals.css";

// Build timestamp: 2026-05-07T11:41:00Z

export async function generateMetadata() {
  // Static favicon — always use the local logo files (not dependent on backend API)
  const faviconConfig = {
    icon: [
      { url: '/favicon.png', sizes: '64x64', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  };

  try {
    const res = await fetch('https://unientry-server-production.up.railway.app/api/settings', {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    const settings = data.data || {};

    const title = settings.heroTitle || "UniEntry — Your Gateway to Global Education";
    const description = settings.heroSubtitle || "UniEntry helps students across India easily access PYQs, important college resources, and trusted guidance for smarter course selection.";

    return {
      title,
      description,
      keywords: "university admissions, study abroad, education consultancy, university fees, scholarships, visa guidance, PYQs, college resources",
      icons: faviconConfig,
      openGraph: {
        title,
        description,
        type: "website",
        images: [{ url: '/logo.png' }],
      },
    };
  } catch (error) {
    return {
      title: "UniEntry — Your Gateway to Global Education",
      description: "UniEntry helps students across India easily access PYQs, important college resources, and trusted guidance for smarter course selection. Your one-stop student platform for academic support, career clarity, and campus success.",
      keywords: "university admissions, study abroad, education consultancy, university fees, scholarships, visa guidance, PYQs, college resources",
      icons: faviconConfig,
      openGraph: {
        title: "UniEntry — Your Gateway to Global Education",
        description: "UniEntry helps students across India easily access PYQs, important college resources, and trusted guidance for smarter course selection.",
        type: "website",
        images: [{ url: '/logo.png' }],
      },
    };
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
