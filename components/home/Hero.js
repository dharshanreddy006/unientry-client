'use client';

import Link from 'next/link';
import { useSettings } from '@/components/providers/SettingsProvider';

export default function Hero() {
  const settings = useSettings();

  const stats = settings?.stats || [
    { number: '200+', label: 'Universities' },
    { number: '15+', label: 'Countries' },
    { number: '5000+', label: 'Students Placed' },
    { number: '95%', label: 'Success Rate' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl animate-float delay-300" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-100/30 rounded-full blur-3xl" />
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #3B82F6 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 text-slate-600 text-sm mb-8 animate-fade-in shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Trusted by {stats[2]?.number || '5000+'} Students Worldwide
        </div>

        {/* Main heading */}
        <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-slate-900 leading-tight mb-6 animate-fade-in-up">
          {settings?.heroTitle || 'Built to Simplify Student Life'}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200 whitespace-pre-wrap">
          {settings?.heroSubtitle || 'Simplify Student Life By Solving Real Problems'}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          <Link
            href="/universities"
            className="group relative px-8 py-4 bg-gradient-to-r from-accent-400 to-accent-600 text-white font-semibold rounded-2xl shadow-lg shadow-accent-500/30 hover:shadow-accent-500/50 transition-smooth hover:scale-105 text-base"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Universities
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
          <button
            onClick={() => {
              const el = document.getElementById('services-hub');
              if (el) {
                const y = el.getBoundingClientRect().top + window.pageYOffset - 40;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }}
            className="group px-8 py-4 bg-white/80 backdrop-blur border border-slate-200 text-slate-700 font-semibold rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 hover:text-blue-600 transition-smooth hover:scale-105 text-base"
          >
            <span className="flex items-center gap-2">
              Our Services
              <svg className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </span>
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-fade-in-up delay-500">
          {stats.map((stat, idx) => (
            <div key={stat.label} className={`${idx % 2 === 0 ? 'bg-amber-50/50 border-amber-100' : 'bg-sky-50/50 border-blue-100'} rounded-2xl p-4 shadow-sm border`}>
              <p className="font-heading font-extrabold text-2xl md:text-3xl text-slate-900">{stat.number}</p>
              <p className="text-slate-500 text-[10px] md:text-sm mt-1 uppercase tracking-wider font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator — points to services */}
      <button
        onClick={() => {
          const el = document.getElementById('services-hub');
          if (el) {
            const y = el.getBoundingClientRect().top + window.pageYOffset - 40;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer p-2 rounded-full hover:bg-white/50 transition-colors"
        aria-label="Scroll to services"
      >
        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
    </section>
  );
}

