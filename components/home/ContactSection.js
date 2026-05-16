'use client';

import { useState } from 'react';
import { useSettings } from '@/components/providers/SettingsProvider';
import { API_URL } from '@/lib/apiConfig';

export default function ContactSection() {
  const settings = useSettings();
  const [form, setForm] = useState({
    studentName: '',
    email: '',
    phone: '',
    interestedUniversity: '',
    message: '',
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      const res = await fetch(`${API_URL}/inquiry/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setStatus({ loading: false, success: true, error: '' });
        setForm({ studentName: '', email: '', phone: '', interestedUniversity: '', message: '' });
      } else {
        setStatus({ loading: false, success: false, error: data.message });
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <section className="section-padding bg-white" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Info */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-50 text-accent-600 text-sm font-medium mb-4">
              📞 Get in Touch
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-900 mb-4">
              Start Your Journey Today
            </h2>

            {/* Contact details */}
            <div className="space-y-5 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a href={`mailto:${settings?.email}`} className="text-primary-900 font-medium hover:text-accent-600 transition-colors">{settings?.email}</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <a href={`tel:${settings?.phone}`} className="text-primary-900 font-medium hover:text-accent-600 transition-colors">{settings?.phone}</a>
                </div>
              </div>
            </div>

            </div>
          </div>

          {/* Right side - Form */}
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <h3 className="font-heading font-semibold text-xl text-primary-900 mb-6">Send us a Message</h3>

            {status.success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                ✅ Your inquiry has been submitted! We&apos;ll contact you soon.
              </div>
            )}
            {status.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                ❌ {status.error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.studentName}
                  onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 outline-none transition-all text-sm bg-white"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 outline-none transition-all text-sm bg-white"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 outline-none transition-all text-sm bg-white"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Interested University</label>
                <input
                  type="text"
                  value={form.interestedUniversity}
                  onChange={(e) => setForm({ ...form, interestedUniversity: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 outline-none transition-all text-sm bg-white"
                  placeholder="e.g., University of Oxford"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 outline-none transition-all text-sm bg-white resize-none"
                  placeholder="Tell us about your goals..."
                />
              </div>
              <button
                type="submit"
                disabled={status.loading}
                className="w-full py-3.5 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {status.loading ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
