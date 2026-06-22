'use client';

import { useSettings } from '@/components/providers/SettingsProvider';
import { getImageUrl } from '@/lib/apiConfig';

export default function FounderSection() {
  const settings = useSettings();

  if (!settings?.founderName) return null;

  const people = [
    {
      name: settings.founderName,
      role: settings.founderRole || 'Founder & CEO',
      image: settings.founderImageUrl,
    },
  ];

  if (settings.coFounderName) {
    people.push({
      name: settings.coFounderName,
      role: settings.coFounderRole || 'Co-Founder',
      image: settings.coFounderImageUrl,
    });
  }

  return (
    <section className="section-padding bg-gradient-to-b from-white to-gray-50 overflow-hidden relative py-16">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-accent-50/50 -skew-x-12 transform origin-top-right z-0" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-50 text-accent-600 text-xs font-black tracking-widest uppercase">
            Meet Our Team
          </span>
        </div>

        {/* Cards */}
        <div className={`grid gap-8 ${people.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'max-w-xl mx-auto'}`}>
          {people.map((person, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-[3rem] p-8 md:p-10 shadow-xl shadow-slate-100/50 flex flex-col items-center text-center group hover:shadow-2xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative mb-6">
                <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-[2rem] overflow-hidden shadow-lg border-4 border-white">
                  <img
                    src={getImageUrl(person.image) || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800'}
                    alt={person.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800';
                    }}
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-accent-100/60 rounded-full blur-xl -z-10" />
                <div className="absolute -top-3 -left-3 w-14 h-14 bg-primary-100/60 rounded-full blur-xl -z-10" />
              </div>

              {/* Name */}
              <h3 className="font-heading font-black text-2xl md:text-3xl text-primary-900 mb-2 leading-tight">
                {person.name}
              </h3>

              {/* Role */}
              <p className="text-accent-600 font-bold text-sm md:text-base uppercase tracking-wider">
                {person.role}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
