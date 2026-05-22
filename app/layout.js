import { SettingsProvider } from '@/components/providers/SettingsProvider';
import "./globals.css";

/**
 * Static metadata — NOT dependent on Railway API.
 * This ensures Google always sees the correct title, description, and favicon,
 * even when the backend is down. The SettingsProvider handles dynamic content
 * on the client side instead.
 */
export const metadata = {
  title: "UniEntry GLOBAL — Your Gateway to Global Education",
  description:
    "UniEntry GLOBAL is a student-focused platform providing university resources, student services, and admission guidance across India. Access PYQs, notes, marketplace, and accommodation — all in one place.",
  keywords:
    "UniEntry GLOBAL, UniEntry, university admissions, study abroad, education consultancy, university fees, scholarships, visa guidance, PYQs, college resources, student marketplace, accommodation, rent and ride",
  metadataBase: new URL("https://unientry.online"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "UniEntry GLOBAL — Your Gateway to Global Education",
    description:
      "UniEntry GLOBAL is a student-focused platform providing university resources, student services, and admission guidance across India.",
    url: "https://unientry.online",
    siteName: "UniEntry Global",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "UniEntry Global Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "UniEntry GLOBAL — Your Gateway to Global Education",
    description:
      "UniEntry GLOBAL is a student-focused platform providing university resources, student services, and admission guidance across India.",
    images: ["/logo.png"],
  },
  verification: {
    google: "TCK7weXOCDsw0g_rutSi5OV0NjiaywbDo4Rl6uckLRY",
  },
  other: {
    "theme-color": "#0EA5E9",
    "apple-mobile-web-app-title": "UniEntry GLOBAL",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts for faster load */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Non-blocking font load with display=swap */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@500;600;700;800&display=swap"
        />
        {/* Preload critical logo for instant display */}
        <link rel="preload" href="/logo.png" as="image" type="image/png" />
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="64x64" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className="antialiased">
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
