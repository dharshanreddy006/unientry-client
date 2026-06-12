'use client';

import { useSettings } from '@/components/providers/SettingsProvider';
import { getImageUrl } from '@/lib/apiConfig';

export default function FounderSection() {
  const settings = useSettings();

  if (!settings?.founderName) return null;

  return (
    <section className="section-padding bg-gradient-to-b from-white to-gray-50 overflow-hidden relative py-16">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-accent-50/50 -skew-x-12 transform origin-top-right z-0" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-[3rem] p-8 md:p-12 shadow-xl shadow-slate-100/50 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          
          {/* Image Side */}
          <div className="relative flex-shrink-0">
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-[2rem] overflow-hidden shadow-lg border-4 border-white">
              <img
                src={getImageUrl(settings.founderImageUrl) || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800'}
                alt={settings.founderName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800';
                }}
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-accent-100/60 rounded-full blur-xl -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary-100/60 rounded-full blur-xl -z-10" />
          </div>

          {/* Text Side */}
          <div className="text-center md:text-left flex-1">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-50 text-accent-600 text-xs font-black mb-4 tracking-widest uppercase">
              Meet Our Founder
            </span>
            
            <h2 className="font-heading font-black text-3xl md:text-4xl text-primary-900 mb-2 leading-tight">
              {settings.founderName}
            </h2>
            
            <p className="text-accent-600 font-bold text-lg md:text-xl uppercase tracking-wider mb-4">
              {settings.founderRole || 'Founder & CEO'}
            </p>
            
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Driving innovation to simplify and enhance the global student journey. Built for students, by students.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
