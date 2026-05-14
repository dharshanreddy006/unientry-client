import { SettingsProvider } from '@/components/providers/SettingsProvider';
import "./globals.css";

// Build timestamp: 2026-05-07T11:41:00Z

export const metadata = {
  title: "UniEntry — Your Gateway to Global Education",
  description: "UniEntry helps students across India easily access PYQs, important college resources, and trusted guidance for smarter course selection. Your one-stop student platform for academic support, career clarity, and campus success",
  keywords: "university admissions, study abroad, education consultancy, university fees, scholarships, visa guidance, PYQs, college resources",
  openGraph: {
    title: "UniEntry — Your Gateway to Global Education",
    description: "UniEntry helps students across India easily access PYQs, important college resources, and trusted guidance for smarter course selection. Your one-stop student platform for academic support, career clarity, and campus success",
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
