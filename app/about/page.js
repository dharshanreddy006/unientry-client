'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/apiConfig';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import WhatsAppButton from '@/components/common/WhatsAppButton';

export default function AboutPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/settings`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(5000),
        });
        const data = await res.json();
        if (data.success) setSettings(data.data);
      } catch (err) {
        // Silently fall back to defaults
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

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

  const team = [
    { name: settings?.founderName || 'Darshan Reddy', role: 'Founder & CEO', initials: 'DR' },
    { name: 'Community Manager', role: 'Head of Support', initials: 'CS' },
    { name: 'Admissions Lead', role: 'Academic Guidance', initials: 'AL' },
    { name: 'Product Developer', role: 'Operations & Engineering', initials: 'PD' },
  ];

  const stats = [
    { number: '10,000+', label: 'Students Helped' },
    { number: '500+', label: 'Accommodations Listed' },
    { number: '2,000+', label: 'Marketplace Trades' },
    { number: '100%', label: 'Student-Driven' },
  ];

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white border border-blue-100 text-blue-600 text-sm font-medium mb-6 shadow-sm">
            🏢 About Us
          </span>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-slate-900 mb-6">
            Simplifying <span className="text-blue-600">Student Life</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            UniEntry is a student-focused tech ecosystem that makes university life easier. We provide a peer-to-peer student marketplace, room/stay accommodations, rent & ride mobility, and academic guidance.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-accent-50 to-blue-50 rounded-3xl p-8 border border-accent-100">
              <div className="w-14 h-14 rounded-2xl bg-accent-500 flex items-center justify-center text-white text-2xl mb-5">🎯</div>
              <h2 className="font-heading font-bold text-2xl text-primary-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To simplify student life by solving everyday campus challenges—such as buying or selling textbooks and items, finding nearby accommodation, renting local transport, and securing referral rewards.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-indigo-50 rounded-3xl p-8 border border-primary-100">
              <div className="w-14 h-14 rounded-2xl bg-primary-700 flex items-center justify-center text-white text-2xl mb-5">🌟</div>
              <h2 className="font-heading font-bold text-2xl text-primary-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To become the ultimate student hub in India, connecting peers and offering all necessary tools to navigate university years smoothly, safely, and cost-effectively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading font-bold text-3xl md:text-4xl text-accent-400">{stat.number}</p>
                <p className="text-white/60 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our dedicated community members and coordinators are here to support your daily student needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 card-hover">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-400 to-primary-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {member.initials}
                </div>
                <h3 className="font-heading font-semibold text-primary-900">{member.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-accent-500 to-accent-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Ready to simplify your college life?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Get in touch with our team today or explore our services to make the most of your student experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-accent-600 rounded-2xl font-semibold hover:shadow-xl transition-all hover:scale-105"
            >
              Contact Us
            </Link>
            <WhatsAppButton
              className="px-8 py-4 bg-white/20 text-white border border-white/30 rounded-2xl font-semibold hover:bg-white/30 transition-all"
            >
              Chat on WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

