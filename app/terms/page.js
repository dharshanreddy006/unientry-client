'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />
      
      <section className="pt-32 pb-20 flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-100 border border-slate-100">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black mb-6 tracking-widest uppercase">
              Legal
            </span>
            <h1 className="font-heading font-black text-3xl md:text-5xl text-primary-900 mb-8 leading-tight">
              Terms & <span className="text-blue-600">Conditions</span>
            </h1>
            
            <div className="prose prose-slate max-w-none text-slate-600 space-y-6 text-sm md:text-base leading-relaxed">
              <p className="font-semibold text-slate-800">Last updated: June 12, 2026</p>
              
              <p>
                Welcome to UniEntry! By accessing or using our website, services, marketplace, rent & ride options, or mobile portals, you agree to comply with and be bound by the following Terms and Conditions. Please review them carefully.
              </p>

              <h3 className="font-heading font-bold text-xl text-primary-900 pt-4">1. Acceptance of Terms</h3>
              <p>
                By using UniEntry, you confirm that you are at least 18 years old or possess legal parental or guardian consent, and are fully able and competent to enter into the terms, conditions, obligations, and representations set forth in these Terms.
              </p>

              <h3 className="font-heading font-bold text-xl text-primary-900 pt-4">2. Services Offered</h3>
              <p>
                UniEntry provides a student utility platform, which includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Student Marketplace:</strong> A peer-to-peer service to browse and inquire about used goods. We are not a party to any transactions between buyers and sellers.</li>
                <li><strong>Stay & Accommodations:</strong> Listings for student rooms and flats. We do not own, manage, or contract the accommodation spaces listed.</li>
                <li><strong>Rent & Ride:</strong> Connecting authorized rental operators with students for vehicle bookings. Personal non-commercial vehicles are not allowed for rent.</li>
                <li><strong>Refer & Earn:</strong> Rewards programs based on successful university admissions.</li>
              </ul>

              <h3 className="font-heading font-bold text-xl text-primary-900 pt-4">3. User Conduct and Integrity</h3>
              <p>
                You agree not to upload, post, or share any content that is fraudulent, illegal, abusive, obscene, or infringing on intellectual property. UniEntry reserves the right to suspend accounts or listings that violate these principles.
              </p>

              <h3 className="font-heading font-bold text-xl text-primary-900 pt-4">4. Limitation of Liability</h3>
              <p>
                UniEntry is a facilitator and is not responsible for the safety, quality, or legality of any accommodation, vehicle, or marketplace item listed by users. Transactions and interactions are carried out entirely at the users' own risk.
              </p>

              <h3 className="font-heading font-bold text-xl text-primary-900 pt-4">5. Modifications to Terms</h3>
              <p>
                We reserve the right to modify these Terms and Conditions at any time. Your continued use of the platform following the posting of changes constitutes acceptance of those changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
