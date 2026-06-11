import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import ServicesHub from '@/components/home/ServicesHub';
import ReferAndEarn from '@/components/features/ReferAndEarn';
import StudentMarketplace from '@/components/features/StudentMarketplace';
import AccommodationSection from '@/components/home/AccommodationSection';
import FounderSection from '@/components/home/FounderSection';
import RentAndRide from '@/components/features/RentAndRide';
import ContactSection from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ServicesHub />
      <StudentMarketplace />
      <AccommodationSection />
      <RentAndRide />
      <ReferAndEarn />
      <FounderSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
