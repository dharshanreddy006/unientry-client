import { SettingsProvider } from '@/components/providers/SettingsProvider';
import "./globals.css";

// Build timestamp: 2026-05-07T11:41:00Z

export async function generateMetadata() {
  try {
    const res = await fetch('https://unientry-server-production.up.railway.app/api/settings', { cache: 'no-store' });
    const data = await res.json();
    const settings = data.data || {};

    const title = settings.heroTitle || "UniEntry — Your Gateway to Global Education";
    const description = settings.heroSubtitle || "UniEntry helps students across India easily access PYQs, important college resources, and trusted guidance for smarter course selection.";
    const getProxiedUrl = (url) => {
      if (!url) return null;
      if (url.includes('up.railway.app')) {
        const parts = url.split('/uploads/');
        return parts[1] ? `/uploads/${parts[1]}?v=${new Date().getTime()}` : url;
      }
      return url;
    };

    const favicon = getProxiedUrl(settings.faviconUrl) || "/favicon.ico";
    const ogImage = getProxiedUrl(settings.logoUrl);

    return {
      title,
      description,
      keywords: "university admissions, study abroad, education consultancy, university fees, scholarships, visa guidance, PYQs, college resources",
      icons: {
        icon: favicon,
        shortcut: favicon,
        apple: favicon,
      },
      openGraph: {
        title,
        description,
        type: "website",
        images: ogImage ? [{ url: ogImage }] : [],
      },
    };
  } catch (error) {
    return {
      title: "UniEntry — Your Gateway to Global Education",
      description: "UniEntry helps students across India easily access PYQs...",
      icons: { icon: "/favicon.ico" }
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
