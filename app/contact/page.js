import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactSection from '@/components/home/ContactSection';

export const metadata = {
  title: 'Contact UniEntry — Get Admission Guidance',
  description: 'Contact UniEntry for university admission guidance, visa support, and scholarship assistance. Reach us via WhatsApp, email, or phone.',
};

export default function ContactPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-slate-900 mb-4">
            Contact Us
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Have questions? Our expert counselors are here to help you. Reach out today!
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />

      {/* Map placeholder */}
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="bg-primary-900 rounded-3xl p-12 text-center">
            <h2 className="font-heading font-bold text-2xl text-white mb-4">Visit Our Office</h2>
            <p className="text-white/60 mb-2">UniEntry GLOBAL</p>
            <p className="text-white/60 mb-6">UPES Dehradun, Uttarakhand, India</p>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-accent-400 font-semibold">Mon - Fri</p>
                <p className="text-white/60 text-sm">9:00 AM - 7:00 PM</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-accent-400 font-semibold">Saturday</p>
                <p className="text-white/60 text-sm">10:00 AM - 4:00 PM</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-accent-400 font-semibold">Sunday</p>
                <p className="text-white/60 text-sm">Closed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
