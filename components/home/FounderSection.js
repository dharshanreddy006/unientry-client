'use client';

import { useSettings } from '@/components/providers/SettingsProvider';
import { getImageUrl } from '@/lib/apiConfig';
import Image from 'next/image';

export default function FounderSection() {
  const settings = useSettings();

  if (!settings?.founderName) return null;

  return (
    <section className="section-padding bg-gradient-to-b from-white to-gray-50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-accent-50/50 -skew-x-12 transform origin-top-right z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Image Side */}
          <div className="w-full lg:w-5/12 relative">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                src={getImageUrl(settings.founderImageUrl) || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800'}
                alt={settings.founderName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent-100 rounded-full blur-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-100 rounded-full blur-2xl -z-10" />
            
            {/* Quote badge */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 lg:-translate-x-0 lg:-right-10 lg:left-auto bg-white p-5 rounded-2xl shadow-xl w-64 animate-fade-in-up">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center flex-shrink-0 text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-primary-900">10+ Years</p>
                  <p className="text-xs text-gray-500">Experience</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="w-full lg:w-7/12 mt-10 lg:mt-0 text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-50 text-accent-600 text-sm font-semibold mb-6 tracking-wide">
              MEET OUR FOUNDER
            </span>
            
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary-900 mb-6 leading-tight">
              A Message from <br className="hidden md:block" />
              <span className="text-accent-600">{settings.founderName}</span>
            </h2>
            
            <div className="text-lg text-gray-600 leading-relaxed mb-8 space-y-6">
              {(settings.founderMessage || '').split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4 lg:gap-8 justify-center lg:justify-start">
              <div>
                <p className="font-heading font-bold text-xl text-primary-900">{settings.founderName}</p>
                <p className="text-accent-600 font-medium">{settings.founderRole}</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-gray-200" />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg" 
                alt="Signature" 
                className="h-10 opacity-30 invert-[0.3]" 
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
