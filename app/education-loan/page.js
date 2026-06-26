'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EducationLoan from '@/components/features/EducationLoan';

export default function EducationLoanPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />
      <div className="pt-24 pb-12 flex-grow">
        <EducationLoan />
      </div>
      <Footer />
    </main>
  );
}
