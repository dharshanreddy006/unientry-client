'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />
      
      <section className="pt-32 pb-20 flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-100 border border-slate-100">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-black mb-6 tracking-widest uppercase">
              Security
            </span>
            <h1 className="font-heading font-black text-3xl md:text-5xl text-primary-900 mb-8 leading-tight">
              Privacy <span className="text-emerald-600">Policy</span>
            </h1>
            
            <div className="prose prose-slate max-w-none text-slate-600 space-y-6 text-sm md:text-base leading-relaxed">
              <p className="font-semibold text-slate-800">Last updated: June 12, 2026</p>
              
              <p>
                At UniEntry, we prioritize the privacy and security of our users. This Privacy Policy details how we collect, store, use, and protect your information when you interact with our platform.
              </p>

              <h3 className="font-heading font-bold text-xl text-primary-900 pt-4">1. Information We Collect</h3>
              <p>
                We may collect personal information such as name, email address, phone number, university affiliation, and WhatsApp contact details when you inquire about accommodations, post marketplace items, or use our rent & ride services.
              </p>

              <h3 className="font-heading font-bold text-xl text-primary-900 pt-4">2. How We Use Your Information</h3>
              <p>
                Your information is used solely to facilitate the connections you request, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Connecting buyers and sellers in the Student Marketplace.</li>
                <li>Forwarding accommodation inquiries to landlords or administration.</li>
                <li>Verifying and listing vehicles for the Rent & Ride service.</li>
                <li>Improving our platform speed, performance, and overall user experience.</li>
              </ul>

              <h3 className="font-heading font-bold text-xl text-primary-900 pt-4">3. Data Sharing</h3>
              <p>
                We do not sell, trade, or lease your personal identification information to third parties. We share contact details only with other platform users (e.g., sharing a seller's WhatsApp link with a buyer) to facilitate peer-to-peer services as initiated by you.
              </p>

              <h3 className="font-heading font-bold text-xl text-primary-900 pt-4">4. Security Measures</h3>
              <p>
                We implement robust security practices to protect your data against unauthorized access, alteration, disclosure, or destruction. However, please note that no internet transmission is 100% secure.
              </p>

              <h3 className="font-heading font-bold text-xl text-primary-900 pt-4">5. Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please reach out to us at <a href="mailto:infounientry@gmail.com" className="text-emerald-600 font-bold hover:underline">infounientry@gmail.com</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
