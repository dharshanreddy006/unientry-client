'use client';

import Link from 'next/link';

export default function AccommodationSection() {
  return (
    <section className="section-padding bg-gray-50" id="accommodation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-50 text-accent-600 text-sm font-medium mb-4">
            🏠 Student Accommodation
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-900 mb-4">
            Find Your Home Away From Home
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Safe, comfortable, and affordable housing options near top universities worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { title: 'Verified Property', desc: 'Every listing is checked for safety and quality to ensure you get what you see.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
            { title: 'Student Safe', desc: 'Live in secure neighborhoods with fellow students from around the world.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
            { title: 'Direct Booking', desc: 'Connect directly with property owners and providers via WhatsApp for quick booking.', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm text-center group hover:-translate-y-2 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </div>
              <h4 className="font-bold text-primary-900 text-lg mb-2">{item.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="text-center">
          <Link
            href="/accommodation"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-900 text-white rounded-xl font-bold hover:bg-primary-800 transition-all hover:scale-105 shadow-lg"
          >
            Explore Accommodations
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
