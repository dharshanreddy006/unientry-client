import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/common/FloatingWhatsApp';
import Hero from '@/components/home/Hero';
import ReferAndEarn from '@/components/features/ReferAndEarn';
import AttendanceCalculator from '@/components/features/AttendanceCalculator';
import UniversityResources from '@/components/features/UniversityResources';
import Testimonials from '@/components/home/Testimonials';
import FounderSection from '@/components/home/FounderSection';
import CGPACalculator from '@/components/features/CGPACalculator';
import ContactSection from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ReferAndEarn />
      <AttendanceCalculator />
      <UniversityResources />
      <Testimonials />
      <FounderSection />
      <CGPACalculator />
      <ContactSection />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
