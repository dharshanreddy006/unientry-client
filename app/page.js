import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import ServicesHub from '@/components/home/ServicesHub';
import FounderSection from '@/components/home/FounderSection';
import PoweredBy from '@/components/home/PoweredBy';
import ContactSection from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ServicesHub />
      <FounderSection />
      <PoweredBy />
      <ContactSection />
      <Footer />
    </main>
  );
}

