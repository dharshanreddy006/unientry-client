'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ReferAndEarn from '@/components/features/ReferAndEarn';

export default function ReferAndEarnPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />
      <div className="pt-24 pb-12 flex-grow">
        <ReferAndEarn />
      </div>
      <Footer />
    </main>
  );
}
