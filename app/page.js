import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/common/FloatingWhatsApp';
import Hero from '@/components/home/Hero';
import FeaturedUniversities from '@/components/home/FeaturedUniversities';
import AttendanceCalculator from '@/components/features/AttendanceCalculator';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';
import FounderSection from '@/components/home/FounderSection';
import CGPACalculator from '@/components/features/CGPACalculator';
import ContactSection from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeaturedUniversities />
      <AttendanceCalculator />
      <WhyChooseUs />
      <Testimonials />
      <FounderSection />
      <CGPACalculator />
      <ContactSection />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
