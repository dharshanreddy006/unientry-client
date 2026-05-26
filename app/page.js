import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import ReferAndEarn from '@/components/features/ReferAndEarn';
import StudentMarketplace from '@/components/features/StudentMarketplace';
import UniversityResources from '@/components/features/UniversityResources';
import AccommodationSection from '@/components/home/AccommodationSection';
import FounderSection from '@/components/home/FounderSection';
import RentAndRide from '@/components/features/RentAndRide';
import ContactSection from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <StudentMarketplace />
      <UniversityResources />
      <AccommodationSection />
      <RentAndRide />
      <ReferAndEarn />
      <FounderSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
