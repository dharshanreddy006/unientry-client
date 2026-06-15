'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HighlightsCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const timeoutRef = useRef(null);

  const slides = [
    {
      type: 'accommodation',
      title: 'Premium Accommodations Near Campus',
      subtitle: 'Safe, fully-furnished, and verified student housing option.',
      badge: 'Student Housing',
      accentColor: 'from-blue-500 to-indigo-600',
      content: {
        title: 'Dharshan Properties',
        location: 'Dehradun, India (Near UPES)',
        price: '₹10,000/month',
        features: ['Co-Living Available', 'Couple Friendly Option', '5 mins walk from campus', 'High-speed Wifi & Gym'],
        ctaText: 'View Available Rooms',
        ctaHref: '/accommodation',
      }
    },
    {
      type: 'review',
      title: 'What Our Students Say',
      subtitle: 'Real reviews from verified students who found their homes with UniEntry.',
      badge: 'Student Reviews',
      accentColor: 'from-amber-500 to-orange-600',
      content: {
        quote: "UniEntry made finding an apartment near UPES incredibly simple! The WhatsApp link connected me directly with the property owner, and I had my room booked in less than 10 minutes. Absolute lifesaver!",
        author: "Aditya Sharma",
        details: "B.Tech Student, UPES Dehradun",
        rating: 5,
        ctaText: 'Read More Reviews',
        ctaHref: '/about',
      }
    },
    {
      type: 'partner',
      title: 'Incubated & Supported By Partners',
      subtitle: 'Backed by leading academic institutions and startup incubators.',
      badge: 'Our Partners',
      accentColor: 'from-emerald-500 to-teal-600',
      content: {
        partners: [
          { name: 'Runway Incubator', logo: '/runway-logo.png', desc: 'Startup Incubator' },
          { name: 'UPES University', logo: '/upes-logo.png', desc: 'University Partner' }
        ],
        ctaText: 'Learn About Our Vision',
        ctaHref: '/about',
      }
    },
    {
      type: 'service',
      title: 'Rent & Ride Campus Mobility',
      subtitle: 'Affordable two-wheelers and rides for university students.',
      badge: 'Rent & Ride',
      accentColor: 'from-rose-500 to-pink-600',
      content: {
        title: 'Student Rider Packs',
        pricing: 'Starting at ₹199/day',
        highlights: ['Verified Vehicles', 'Helmet Included', 'Maintenance Cover', 'Zero Security Deposit'],
        ctaText: 'Explore Ride Listings',
        ctaHref: '/#rent-and-ride',
      }
    }
  ];

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setActiveSlide((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1)),
      4500
    );

    return () => {
      resetTimeout();
    };
  }, [activeSlide]);

  return (
    <section className="py-8 w-full max-w-4xl mx-auto px-4">
      {/* Sliding card shell with premium Apple glass theme */}
      <div className="relative overflow-hidden rounded-[32px] glass-panel border border-white/40 shadow-xl transition-all duration-500">
        
        {/* Carousel items wrapper */}
        <div 
          className="flex transition-transform duration-700 ease-in-out" 
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div key={idx} className="w-full flex-shrink-0 p-8 sm:p-12 flex flex-col md:flex-row gap-8 items-center justify-between min-h-[360px]">
              
              {/* Left Column: Title and details */}
              <div className="flex-1 text-left space-y-4">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r ${slide.accentColor}`}>
                  {slide.badge}
                </span>
                
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 leading-tight">
                  {slide.title}
                </h3>
                
                <p className="text-sm text-slate-500 max-w-md">
                  {slide.subtitle}
                </p>

                <div className="pt-2">
                  <Link 
                    href={slide.content.ctaHref}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all duration-300 active:scale-95 shadow-lg shadow-slate-900/10"
                  >
                    {slide.content.ctaText}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual highlights (Dynamic based on slide type) */}
              <div className="flex-1 w-full max-w-sm">
                
                {/* Accommodation Preview Card */}
                {slide.type === 'accommodation' && (
                  <div className="bg-white/70 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-md space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{slide.content.title}</h4>
                        <p className="text-xs text-slate-400">{slide.content.location}</p>
                      </div>
                      <span className="text-xs font-black text-blue-600 px-2 py-1 bg-blue-50 rounded-lg">
                        {slide.content.price}
                      </span>
                    </div>
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      {slide.content.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                          <span className="text-emerald-500">✓</span> {feat}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Card */}
                {slide.type === 'review' && (
                  <div className="bg-white/70 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-md space-y-4 relative">
                    <span className="absolute -top-3 -left-1 text-5xl text-blue-100 font-serif pointer-events-none select-none">“</span>
                    <p className="text-xs text-slate-600 leading-relaxed italic relative z-10">
                      {slide.content.quote}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs">{slide.content.author}</h4>
                        <p className="text-[10px] text-slate-400">{slide.content.details}</p>
                      </div>
                      <div className="flex gap-0.5 text-amber-400">
                        {[...Array(slide.content.rating)].map((_, i) => (
                          <span key={i} className="text-xs">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Partner Logo showcase */}
                {slide.type === 'partner' && (
                  <div className="grid grid-cols-2 gap-3">
                    {slide.content.partners.map((partner, i) => (
                      <div key={i} className="bg-white/70 backdrop-blur rounded-2xl p-4 border border-white/60 shadow-md flex flex-col items-center justify-center text-center">
                        <img 
                          src={partner.logo} 
                          alt={partner.name}
                          className="h-10 w-auto object-contain mb-2"
                        />
                        <h4 className="font-bold text-slate-800 text-[10px] leading-tight">{partner.name}</h4>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">{partner.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Service highlights (Rent & Ride) */}
                {slide.type === 'service' && (
                  <div className="bg-white/70 backdrop-blur rounded-2xl p-5 border border-white/60 shadow-md space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{slide.content.title}</h4>
                        <p className="text-xs text-slate-400">Campus Scooters & Bikes</p>
                      </div>
                      <span className="text-xs font-black text-rose-600 px-2 py-1 bg-rose-50 rounded-lg">
                        {slide.content.pricing}
                      </span>
                    </div>
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      {slide.content.highlights.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                          <span className="text-rose-500">🚲</span> {feat}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

        {/* Carousel indicators/dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${activeSlide === idx ? 'w-6 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Navigation arrows (hidden on small screens) */}
        <button
          onClick={() => setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/40 hover:bg-white/80 border border-white/50 text-slate-700 transition-all duration-200 hidden md:block"
          aria-label="Previous slide"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/40 hover:bg-white/80 border border-white/50 text-slate-700 transition-all duration-200 hidden md:block"
          aria-label="Next slide"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

      </div>
    </section>
  );
}
