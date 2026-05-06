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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
