import { SettingsProvider } from '@/components/providers/SettingsProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import AuthGate from '@/components/auth/AuthGate';
import "./globals.css";

/**
 * Static metadata — NOT dependent on Railway API.
 * This ensures Google always sees the correct title, description, and favicon,
 * even when the backend is down. The SettingsProvider handles dynamic content
 * on the client side instead.
 */
export const metadata = {
  title: "UniEntry GLOBAL — Built to Simplify Student Life",
  description:
    "UniEntry GLOBAL is a student tech ecosystem that simplifies student life. Access student marketplace (buy & sell), university resources (PYQs, notes), student accommodation, rent & ride services, and more — all in one platform. Founded by Darshan Reddy.",
  keywords:
    "UniEntry GLOBAL, UniEntry, student ecosystem, student marketplace, buy and sell, university resources, PYQs, notes, student accommodation, rent and ride, student life, student services, student tech platform, Darshan Reddy",
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
    title: "UniEntry GLOBAL — Built to Simplify Student Life",
    description:
      "UniEntry GLOBAL is a student tech ecosystem — student marketplace, university resources, accommodation, rent & ride, and more. Founded by Darshan Reddy.",
    url: "https://unientry.online",
    siteName: "UniEntry GLOBAL",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "UniEntry GLOBAL Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "UniEntry GLOBAL — Built to Simplify Student Life",
    description:
      "Student tech ecosystem — marketplace, resources, accommodation, rent & ride. Founded by Darshan Reddy.",
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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0EA5E9',
};

// JSON-LD Structured Data for Google Knowledge Panel
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "UniEntry GLOBAL",
  alternateName: "UniEntry",
  url: "https://unientry.online",
  logo: "https://unientry.online/logo.png",
  description:
    "UniEntry GLOBAL is a student tech ecosystem built to simplify student life. We provide student marketplace, university resources, student accommodation, rent & ride services, and more.",
  founder: {
    "@type": "Person",
    name: "Darshan Reddy",
    jobTitle: "Founder & CEO",
    url: "https://unientry.online/about",
  },
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Hindi"],
  },
};

const founderSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Darshan Reddy",
  jobTitle: "Founder & CEO",
  worksFor: {
    "@type": "Organization",
    name: "UniEntry GLOBAL",
    url: "https://unientry.online",
  },
  description:
    "Darshan Reddy is the Founder & CEO of UniEntry GLOBAL, a student tech ecosystem built to simplify student life through marketplace, resources, accommodation, and mobility services.",
  url: "https://unientry.online/about",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "UniEntry GLOBAL",
  alternateName: "UniEntry",
  url: "https://unientry.online",
  description:
    "Student tech ecosystem — marketplace, university resources, accommodation, rent & ride. Built to simplify student life.",
  publisher: {
    "@type": "Organization",
    name: "UniEntry GLOBAL",
    logo: {
      "@type": "ImageObject",
      url: "https://unientry.online/logo.png",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Viewport is handled by Next.js viewport export — do NOT add manual meta tag */}
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

        {/* JSON-LD Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(founderSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <SettingsProvider>
            <AuthGate>
              {children}
            </AuthGate>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
