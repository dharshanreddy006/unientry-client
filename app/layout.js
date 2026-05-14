import { SettingsProvider } from '@/components/providers/SettingsProvider';
import "./globals.css";

// Build timestamp: 2026-05-07T11:41:00Z

export const metadata = {
  title: "UniEntry — Your Gateway to Global Education",
  description: "UniEntry helps students explore top universities worldwide, get expert guidance for admissions, visas, and scholarships. Start your study abroad journey ",
  keywords: "university admissions, study abroad, education consultancy, university fees, scholarships, visa guidance",
  openGraph: {
    title: "UniEntry — Your Gateway to Global Education",
    description: "UniEntry helps students explore top universities worldwide, get expert guidance for admissions, visas, and scholarships. Start your study abroad journey ",
    type: "website",
  },
};

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
