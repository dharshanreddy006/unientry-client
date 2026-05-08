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
          cache: 'no-store'
        });
        const data = await res.json();
        if (data.success) setSettings(data.data);
      } catch (err) {
        console.error('Error fetching settings:', err);
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

  const team = settings?.team || [
    { name: 'Dr. Rajesh Kumar', role: 'Founder & CEO', initials: 'RK' },
    { name: 'Anita Desai', role: 'Head of Admissions', initials: 'AD' },
    { name: 'Michael Chen', role: 'Visa Counselor', initials: 'MC' },
    { name: 'Sarah Wilson', role: 'Career Advisor', initials: 'SW' },
  ];

  const stats = settings?.stats || [
    { number: '5000+', label: 'Students Guided' },
    { number: '200+', label: 'Partner Universities' },
    { number: '15+', label: 'Countries' },
    { number: '95%', label: 'Visa Success Rate' },
  ];

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-accent-400 text-sm font-medium mb-6">
            🏢 About Us
          </span>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-white mb-6">
            Helping Students Achieve Their <span className="text-accent-400">Global Dreams</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            {settings?.aboutText || 'UniEntry is a trusted educational consultancy that has helped thousands of students achieve their dream of studying at top universities worldwide.'}
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
                {settings?.aboutMission || 'To democratize access to quality international education by providing expert guidance, comprehensive support, and transparent information to every aspiring student, regardless of their background.'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-indigo-50 rounded-3xl p-8 border border-primary-100">
              <div className="w-14 h-14 rounded-2xl bg-primary-700 flex items-center justify-center text-white text-2xl mb-5">🌟</div>
              <h2 className="font-heading font-bold text-2xl text-primary-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                {settings?.aboutVision || 'To become the most trusted and comprehensive education consultancy platform, connecting students with the best universities worldwide and shaping the future leaders of tomorrow.'}
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
              Our experienced team of counselors and advisors are here to guide you at every step
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
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Get in touch with us today and let&apos;s make your dream university a reality.
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

