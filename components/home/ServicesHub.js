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
        className="w-full h-full object-contain scale-[1.4]"
      />
    ),
    bgColor: '#f6f8f7',
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
        className="w-full h-full object-contain scale-[1.35]"
      />
    ),
    bgColor: '#f6fcfb',
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
        className="w-full h-full object-contain scale-[1.45]"
      />
    ),
    bgColor: '#fefefd',
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
        className="w-full h-full object-contain scale-[1.4]"
      />
    ),
    bgColor: '#ecedea',
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
      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
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
      </div>
    ),
    bgColor: '#ffffff',
    gradient: 'from-slate-500 to-slate-700',
    glow: 'shadow-slate-500/20',
    bgAccent: 'bg-slate-50',
    textAccent: 'text-slate-600',
    borderAccent: 'border-slate-200',
  },
];

const Accommodation3DScene = ({ mousePos }) => {
  // Translate mousePos (-0.5 to 0.5) to tilt angles
  const rotateX = -15 + mousePos.y * -25; // Base tilt of -15deg, moves by +/- 12.5deg
  const rotateY = 45 + mousePos.x * 25;   // Base angle of 45deg, moves by +/- 12.5deg

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none overflow-hidden">
      {/* 3D Scene Wrapper */}
      <div 
        className="relative w-32 h-32 flex items-center justify-center transition-transform duration-700 ease-out"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Parallax container */}
        <div 
          className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          }}
        >
          {/* Drifting Clouds */}
          <div className="absolute top-0 left-0 w-8 h-2.5 bg-white/50 rounded-full blur-[1px]"
            style={{
              animation: 'driftCloud 12s linear infinite',
              transform: 'translateZ(-50px) translateY(-10px)',
            }}
          />
          <div className="absolute top-4 right-0 w-10 h-3.5 bg-white/40 rounded-full blur-[1px]"
            style={{
              animation: 'driftCloud 16s linear infinite reverse',
              transform: 'translateZ(-70px) translateY(-5px)',
            }}
          />

          {/* Floating Location Pin */}
          <div className="absolute -top-3 w-5 h-5 z-30"
            style={{
              transform: 'translateZ(30px) translateY(-5px)',
              animation: 'bouncePin 2s ease-in-out infinite',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(245,158,11,0.4)]">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#f59e0b" />
            </svg>
          </div>

          {/* Isometric Building Container */}
          <div 
            className="absolute bottom-6 w-12 h-16 transition-all duration-1000 ease-out transform origin-bottom scale-y-100"
            style={{
              transformStyle: 'preserve-3d',
              animation: 'riseBuilding 1s cubic-bezier(0.16, 1, 0.3, 1) both',
            }}
          >
            {/* Front Wall (Glass Facade) */}
            <div className="absolute inset-0 bg-sky-500/20 backdrop-blur-[2px] border border-white/30 flex flex-col justify-between p-0.5"
              style={{
                transform: 'rotateY(0deg) translateZ(24px)',
                transformStyle: 'preserve-3d',
                boxShadow: 'inset 0 0 8px rgba(255,255,255,0.25)',
              }}
            >
              {/* Floor Lines & Windows */}
              {[...Array(4)].map((_, floor) => (
                <div key={floor} className="flex justify-around border-b border-white/10 pb-0.5 last:border-0">
                  <div className="w-3 h-2.5 bg-white/15 border border-white/5"
                    style={{ 
                      animation: 'windowGlow 1.5s ease-in-out infinite alternate',
                      animationDelay: `${floor * 250 + 200}ms`
                    }} 
                  />
                  <div className="w-3 h-2.5 bg-white/15 border border-white/5"
                    style={{ 
                      animation: 'windowGlow 1.5s ease-in-out infinite alternate',
                      animationDelay: `${floor * 250 + 400}ms`
                    }} 
                  />
                </div>
              ))}
            </div>

            {/* Right Wall */}
            <div className="absolute inset-0 bg-sky-600/30 backdrop-blur-[2px] border border-white/25 flex flex-col justify-between p-0.5"
              style={{
                transform: 'rotateY(90deg) translateZ(24px)',
                transformStyle: 'preserve-3d',
                boxShadow: 'inset 0 0 8px rgba(255,255,255,0.15)',
              }}
            >
              {[...Array(4)].map((_, floor) => (
                <div key={floor} className="flex justify-around border-b border-white/10 pb-0.5 last:border-0">
                  <div className="w-3 h-2.5 bg-white/15 border border-white/5"
                    style={{ 
                      animation: 'windowGlow 1.5s ease-in-out infinite alternate',
                      animationDelay: `${floor * 250 + 300}ms`
                    }} 
                  />
                  <div className="w-3 h-2.5 bg-white/15 border border-white/5"
                    style={{ 
                      animation: 'windowGlow 1.5s ease-in-out infinite alternate',
                      animationDelay: `${floor * 250 + 500}ms`
                    }} 
                  />
                </div>
              ))}
            </div>

            {/* Left Wall (Shadow Side) */}
            <div className="absolute inset-0 bg-sky-950/15 backdrop-blur-[1px] border border-white/5"
              style={{
                transform: 'rotateY(-90deg) translateZ(24px)',
              }}
            />

            {/* Back Wall */}
            <div className="absolute inset-0 bg-sky-900/5"
              style={{
                transform: 'rotateY(180deg) translateZ(24px)',
              }}
            />

            {/* Roof */}
            <div className="absolute bg-gradient-to-tr from-sky-400/30 to-blue-500/15 border border-white/40"
              style={{
                transform: 'rotateX(90deg) translateZ(24px)',
                width: '48px',
                height: '48px',
                left: '0px',
                boxShadow: 'inset 0 0 10px rgba(255,255,255,0.4)',
              }}
            >
              <div className="absolute inset-2 border border-white/30 bg-white/10 backdrop-blur-xs" />
            </div>

            {/* Ground Base */}
            <div className="absolute -bottom-1.5 w-16 h-16 bg-slate-950/25 blur-[2px] rounded-full"
              style={{
                transform: 'rotateX(90deg) translateZ(-3px)',
                left: '-8px',
              }}
            />
          </div>

          {/* Swaying Trees */}
          <div className="absolute bottom-3 left-7 w-2.5 h-4"
            style={{
              transform: 'rotateX(-20deg) rotateY(45deg) translateZ(8px)',
              animation: 'swayTree 3s ease-in-out infinite alternate',
              transformOrigin: 'bottom center',
            }}
          >
            <div className="w-1.5 h-2.5 bg-emerald-500/80 rounded-t-full mx-auto" />
            <div className="w-0.5 h-1.5 bg-amber-800/80 mx-auto" />
          </div>
          
          <div className="absolute bottom-3 right-7 w-3 h-5"
            style={{
              transform: 'rotateX(-20deg) rotateY(45deg) translateZ(8px)',
              animation: 'swayTree 4s ease-in-out infinite alternate-reverse',
              transformOrigin: 'bottom center',
            }}
          >
            <div className="w-2 h-3.5 bg-teal-500/80 rounded-t-full mx-auto" />
            <div className="w-0.5 h-2 bg-amber-900/80 mx-auto" />
          </div>

          {/* Student */}
          <div className="absolute bottom-3 left-1/2 w-1.5 h-2.5 bg-slate-700/70 rounded-full"
            style={{
              transform: 'rotateX(-20deg) rotateY(45deg) translateZ(16px)',
              animation: 'walkToDoor 5s linear infinite',
            }}
          />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes riseBuilding {
          from { transform: scaleY(0) translateY(16px); opacity: 0; }
          to { transform: scaleY(1) translateY(0); opacity: 1; }
        }
        @keyframes bouncePin {
          0%, 100% { transform: translateY(0) scale(1) translateZ(30px); }
          50% { transform: translateY(-5px) scale(1.05) translateZ(30px); }
        }
        @keyframes driftCloud {
          0% { transform: translateX(-15px) translateZ(-50px); opacity: 0; }
          15% { opacity: 0.5; }
          85% { opacity: 0.5; }
          100% { transform: translateX(35px) translateZ(-50px); opacity: 0; }
        }
        @keyframes swayTree {
          0% { transform: rotate(0deg) rotateX(-20deg) rotateY(45deg) translateZ(8px); }
          100% { transform: rotate(6deg) rotateX(-20deg) rotateY(45deg) translateZ(8px); }
        }
        @keyframes walkToDoor {
          0% { transform: translate(-10px, 0) scale(0.8) rotateX(-20deg) rotateY(45deg) translateZ(16px); opacity: 0; }
          15% { opacity: 0.9; }
          85% { opacity: 0.9; }
          100% { transform: translate(3px, -4px) scale(0.6) rotateX(-20deg) rotateY(45deg) translateZ(16px); opacity: 0; }
        }
        @keyframes windowGlow {
          0% { background-color: rgba(255, 255, 255, 0.15); box-shadow: none; }
          100% { background-color: rgba(253, 224, 71, 0.9); box-shadow: 0 0 6px rgba(253, 224, 71, 0.75); }
        }
      `}} />
    </div>
  );
};

export default function ServicesHub() {
  const router = useRouter();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e, id) => {
    if (id !== 'accommodation') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

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
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => {
                setHoveredCard(null);
                setMousePos({ x: 0, y: 0 });
              }}
              onMouseMove={(e) => handleMouseMove(e, service.id)}
              className={`services-hub-card group relative flex flex-col items-center gap-3 sm:gap-4 p-5 sm:p-6 rounded-[2rem]
                border-2 ${service.borderAccent} 
                hover:shadow-2xl ${service.glow}
                active:scale-95 cursor-pointer
                transition-all duration-300 ease-out`}
              style={{
                backgroundColor: service.bgColor,
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
              <div className="relative w-full h-24 sm:h-28 flex items-center justify-center overflow-hidden flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                {service.id === 'accommodation' ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Original static icon with fade out and rotate flip */}
                    <div className={`absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-500 ease-out ${
                      hoveredCard === 'accommodation' ? 'opacity-0 scale-90 -rotate-y-180' : 'opacity-100 scale-100 rotate-y-0'
                    }`}>
                      {service.icon}
                    </div>
                    {/* Custom 3D isometric micro-animated scene */}
                    <div className={`absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-500 ease-out ${
                      hoveredCard === 'accommodation' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}>
                      <Accommodation3DScene mousePos={mousePos} />
                    </div>
                  </div>
                ) : (
                  service.icon
                )}
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
