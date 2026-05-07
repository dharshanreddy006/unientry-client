import { SettingsProvider } from '@/components/providers/SettingsProvider';
import "./globals.css";

export const metadata = {
  title: "UniEntry — Your Gateway to Global Education",
  description: "UniEntry helps students explore top universities worldwide, get expert guidance for admissions, visas, and scholarships. Start your study abroad journey today!",
  keywords: "university admissions, study abroad, education consultancy, university fees, scholarships, visa guidance",
  openGraph: {
    title: "UniEntry — Your Gateway to Global Education",
    description: "Discover top universities worldwide. Get expert guidance for admissions, visas, and scholarships.",
    type: "website",
  },
};

async function getSettings() {
  try {
    const res = await fetch('https://unientry-server-production.up.railway.app/api/settings', { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (e) {
    return null;
  }
}

export default async function RootLayout({ children }) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <body className="antialiased">
        <SettingsProvider initialSettings={settings}>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
