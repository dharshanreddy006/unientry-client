'use client';

import { useRef, useEffect, useState } from 'react';

const services = [
  {
    id: 'marketplace',
    name: 'Buy & Sell',
    subtitle: 'Student Marketplace',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#marketplace-bg)" />
        <path d="M16 20h16M16 26h10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="32" r="6" fill="#fff" fillOpacity="0.25" />
        <path d="M30 32l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="marketplace-bg" x1="4" y1="4" x2="44" y2="44">
            <stop stopColor="#0EA5E9" />
            <stop offset="1" stopColor="#2563EB" />
          </linearGradient>
        </defs>
      </svg>
    ),
    gradient: 'from-sky-500 to-blue-600',
    glow: 'shadow-sky-500/20',
    bgAccent: 'bg-sky-50',
    textAccent: 'text-sky-600',
    borderAccent: 'border-sky-100',
  },
  {
    id: 'accommodation',
    name: 'Stay',
    subtitle: 'Accommodation',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#accom-bg)" />
        <path d="M12 34V22l12-8 12 8v12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="20" y="26" width="8" height="8" rx="1" stroke="#fff" strokeWidth="2" />
        <circle cx="24" cy="18" r="2" fill="#FDE68A" />
        <defs>
          <linearGradient id="accom-bg" x1="4" y1="4" x2="44" y2="44">
            <stop stopColor="#F59E0B" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
        </defs>
      </svg>
    ),
    gradient: 'from-amber-500 to-amber-700',
    glow: 'shadow-amber-500/20',
    bgAccent: 'bg-amber-50',
    textAccent: 'text-amber-600',
    borderAccent: 'border-amber-100',
  },
  {
    id: 'rent-and-ride',
    name: 'Rent & Ride',
    subtitle: 'Vehicles on Demand',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#ride-bg)" />
        <path d="M12 30h24" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 30l3-10h14l3 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="18" cy="32" r="3" stroke="#fff" strokeWidth="2" />
        <circle cx="30" cy="32" r="3" stroke="#fff" strokeWidth="2" />
        <rect x="20" y="22" width="8" height="4" rx="1" stroke="#fff" strokeWidth="1.5" />
        <defs>
          <linearGradient id="ride-bg" x1="4" y1="4" x2="44" y2="44">
            <stop stopColor="#10B981" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
    ),
    gradient: 'from-emerald-500 to-emerald-700',
    glow: 'shadow-emerald-500/20',
    bgAccent: 'bg-emerald-50',
    textAccent: 'text-emerald-600',
    borderAccent: 'border-emerald-100',
  },
  {
    id: 'refer-and-earn',
    name: 'Refer & Earn',
    subtitle: 'Earn Rewards',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#refer-bg)" />
        <circle cx="24" cy="20" r="6" stroke="#fff" strokeWidth="2" />
        <path d="M16 34c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <path d="M34 16l4 4-4 4" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M38 20h-8" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
        <defs>
          <linearGradient id="refer-bg" x1="4" y1="4" x2="44" y2="44">
            <stop stopColor="#EC4899" />
            <stop offset="1" stopColor="#BE185D" />
          </linearGradient>
        </defs>
      </svg>
    ),
    gradient: 'from-pink-500 to-pink-700',
    glow: 'shadow-pink-500/20',
    bgAccent: 'bg-pink-50',
    textAccent: 'text-pink-600',
    borderAccent: 'border-pink-100',
  },
  {
    id: 'contact',
    name: 'Contact Us',
    subtitle: 'Get in Touch',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#contact-bg)" />
        <rect x="10" y="14" width="28" height="20" rx="4" stroke="#fff" strokeWidth="2" />
        <path d="M10 18l14 8 14-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="contact-bg" x1="4" y1="4" x2="44" y2="44">
            <stop stopColor="#64748B" />
            <stop offset="1" stopColor="#334155" />
          </linearGradient>
        </defs>
      </svg>
    ),
    gradient: 'from-slate-500 to-slate-700',
    glow: 'shadow-slate-500/20',
    bgAccent: 'bg-slate-50',
    textAccent: 'text-slate-600',
    borderAccent: 'border-slate-200',
  },
];

export default function ServicesHub() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80; // navbar height offset
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="services-hub"
      className="relative py-10 sm:py-14 md:py-16 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200/60 to-transparent" />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div
          className="text-center mb-8 sm:mb-10"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Our Services
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-slate-900 leading-tight">
            Everything You Need,{' '}
            <span className="gradient-text">One Platform</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-3 max-w-lg mx-auto">
            Tap any service to explore — built for students, by students
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {services.map((service, index) => (
            <button
              key={service.id}
              onClick={() => handleScrollTo(service.id)}
              className={`services-hub-card group relative flex flex-col items-center gap-2.5 sm:gap-3 p-4 sm:p-5 rounded-2xl sm:rounded-3xl
                bg-white border ${service.borderAccent} 
                hover:shadow-xl ${service.glow}
                active:scale-[0.96] cursor-pointer
                transition-all duration-300 ease-out`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms`,
              }}
              aria-label={`Go to ${service.name}`}
            >
              {/* Hover gradient overlay */}
              <div
                className={`absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`}
              />

              {/* Icon */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
                {service.icon}
              </div>

              {/* Label */}
              <div className="text-center min-h-[2.5rem] flex flex-col justify-center">
                <span className={`font-heading font-bold text-xs sm:text-sm text-slate-800 group-hover:${service.textAccent} transition-colors duration-200 leading-tight`}>
                  {service.name}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 mt-0.5 leading-tight hidden sm:block">
                  {service.subtitle}
                </span>
              </div>

              {/* Bottom accent line on hover */}
              <div
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full bg-gradient-to-r ${service.gradient} 
                  w-0 group-hover:w-3/4 transition-all duration-300`}
              />
            </button>
          ))}
        </div>

        {/* Scroll hint for mobile */}
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-xs sm:hidden">
          <svg className="w-3.5 h-3.5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span>Tap to jump to any section</span>
        </div>
      </div>
    </section>
  );
}
