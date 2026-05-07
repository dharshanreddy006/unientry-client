'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';

export default function InternshipDetailsPage() {
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const res = await fetch(
          `${'https://unientry-server-production.up.railway.app/api'}/internships/${id}`
        );
        const data = await res.json();
        if (data.success) setInternship(data.data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchInternship();
  }, [id]);

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="w-12 h-12 border-4 border-accent-200 border-t-accent-500 rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (!internship) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center pt-20">
          <p className="text-gray-500 text-lg mb-4">Internship not found</p>
          <Link href="/internships" className="text-accent-600 font-medium hover:underline">← Back to Internships</Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />

      <section className="hero-gradient pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/internships" className="text-white/60 hover:text-white text-sm mb-6 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Internships
          </Link>

          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className="font-heading font-bold text-2xl text-white">{internship.companyName.charAt(0)}</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-3xl md:text-4xl text-white mb-2">{internship.role}</h1>
              <p className="text-white/70 text-lg">{internship.companyName}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Duration', value: internship.duration, icon: '⏱' },
              { label: 'Stipend', value: internship.stipend, icon: '💰' },
              { label: 'Work Type', value: `${internship.type} · ${internship.location}`, icon: '📍' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
                <span className="text-2xl">{item.icon}</span>
                <p className="font-bold text-primary-900 mt-2">{item.value}</p>
                <p className="text-gray-400 text-xs mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 mb-6">
            <h2 className="font-heading font-semibold text-xl text-primary-900 mb-4">About This Internship</h2>
            <p className="text-gray-600 leading-relaxed">{internship.description}</p>
          </div>

          {internship.skills?.length > 0 && (
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 mb-6">
              <h2 className="font-heading font-semibold text-xl text-primary-900 mb-4">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {internship.skills.map((skill) => (
                  <span key={skill} className="px-4 py-2 bg-accent-50 text-accent-700 rounded-xl text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <WhatsAppButton
              text={`Hi UniEntry! I am interested in the ${internship.role} internship at ${internship.companyName}.`}
              className="whatsapp-btn flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold flex-1"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Inquire on WhatsApp
            </WhatsAppButton>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:shadow-lg transition-all flex-1"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
