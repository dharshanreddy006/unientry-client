'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const services = [
  {
    id: 'marketplace',
    name: 'Buy & Sell',
    subtitle: 'Student Marketplace',
    icon: (
      <img
        src="/service-marketplace.png"
        alt="Buy & Sell"
        className="w-full h-full object-contain"
      />
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
      <img
        src="/service-accommodation.png"
        alt="Stay"
        className="w-full h-full object-contain"
      />
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
      <img
        src="/service-rent-ride.png"
        alt="Rent & Ride"
        className="w-full h-full object-contain"
      />
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
      <img
        src="/service-refer-earn.png"
        alt="Refer & Earn"
        className="w-full h-full object-contain"
      />
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
  const router = useRouter();
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

  const handleServiceClick = (id) => {
    if (id === 'contact') {
      router.push('/contact');
    } else if (id === 'marketplace') {
      router.push('/marketplace');
    } else if (id === 'accommodation') {
      router.push('/accommodation');
    } else if (id === 'rent-and-ride') {
      router.push('/rent-and-ride');
    } else if (id === 'refer-and-earn') {
      router.push('/refer-and-earn');
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <button
              key={service.id}
              onClick={() => handleServiceClick(service.id)}
              className={`services-hub-card group relative flex flex-col items-center gap-3 sm:gap-4 p-5 sm:p-6 rounded-[2rem]
                bg-white border-2 ${service.borderAccent} 
                hover:shadow-2xl ${service.glow}
                active:scale-95 cursor-pointer
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
                className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300`}
              />

              {/* Icon */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                {service.icon}
              </div>

              {/* Label */}
              <div className="text-center">
                <span className={`font-heading font-black text-sm sm:text-base text-slate-800 group-hover:${service.textAccent} transition-colors duration-200 leading-tight block`}>
                  {service.name}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 mt-1 leading-tight block">
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
      </div>
    </section>
  );
}
