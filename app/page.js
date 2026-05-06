import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/common/FloatingWhatsApp';
import Hero from '@/components/home/Hero';
import FeaturedUniversities from '@/components/home/FeaturedUniversities';
import StudyAbroad from '@/components/home/StudyAbroad';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';
import ContactSection from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeaturedUniversities />
      <StudyAbroad />
      <WhyChooseUs />
      <Testimonials />
      <ContactSection />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
