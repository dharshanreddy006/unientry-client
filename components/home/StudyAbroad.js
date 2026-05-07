'use client';

import { useState, useEffect } from 'react';

export default function StudyAbroad() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || 'https://unientry-server-production.up.railway.app/api';
        const res = await fetch(`${API}/destinations`);
        const data = await res.json();
        if (data.success) {
          setDestinations(data.data);
        }
      } catch (err) {
        console.error('Error fetching destinations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-accent-200 border-t-accent-500 rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (destinations.length === 0) return null;
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-4">
            🌍 Study Abroad
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-900 mb-4">
            Popular Study Destinations
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore the most sought-after countries for international education
          </p>
        </div>

        {/* Countries grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((country, index) => (
            <Link
              key={country.id}
              href={`/universities?country=${country.name}`}
              className={`group relative overflow-hidden rounded-2xl card-hover ${
                index < 2 ? 'sm:col-span-1 lg:col-span-1' : ''
              } ${index === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="relative h-72">
                <img
                  src={country.imageUrl}
                  alt={`Study in ${country.name}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/40 to-transparent" />
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{country.flag}</span>
                    <h3 className="font-heading font-bold text-xl text-white">{country.name}</h3>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {country.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-accent-400 text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Explore Universities
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
