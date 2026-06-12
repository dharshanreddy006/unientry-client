'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StudentMarketplace from '@/components/features/StudentMarketplace';

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />
      <div className="pt-24 pb-12 flex-grow">
        <StudentMarketplace />
      </div>
      <Footer />
    </main>
  );
}
