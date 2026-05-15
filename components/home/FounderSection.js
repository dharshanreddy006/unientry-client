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
          <div className="w-full lg:w-4/12 relative flex justify-center">
            <div className="relative w-52 h-52 md:w-64 md:h-64 rounded-[2rem] overflow-hidden shadow-2xl">
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
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent-100 rounded-full blur-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-100 rounded-full blur-2xl -z-10" />
            
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
