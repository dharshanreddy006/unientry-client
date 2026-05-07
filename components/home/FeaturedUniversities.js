'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const flagMap = {
  'Germany': '🇩🇪',
  'UK': '🇬🇧',
  'USA': '🇺🇸',
  'Canada': '🇨🇦',
  'Australia': '🇦🇺',
  'India': '🇮🇳',
};

export default function FeaturedUniversities() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const API = 'https://unientry-server-production.up.railway.app/api';
        const res = await fetch(`${API}/universities/featured`);
        const data = await res.json();
        if (data.success) {
          setUniversities(data.data);
        }
      } catch (err) {
        console.error('Error fetching featured universities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-accent-200 border-t-accent-500 rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (universities.length === 0) return null;
  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-50 text-accent-600 text-sm font-medium mb-4">
            🎓 Top Universities
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-900 mb-4">
            Featured Universities
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore our curated selection of world-class universities across the globe
          </p>
        </div>

        {/* University grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((uni, index) => (
            <div
              key={uni._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 card-hover border border-gray-100"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={uni.coverImage?.url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=600'}
                  alt={uni.universityName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary-900 flex items-center gap-1">
                  {flagMap[uni.country] || '📍'} {uni.country}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-heading font-semibold text-lg text-primary-900 mb-2 group-hover:text-accent-600 transition-colors">
                  {uni.universityName}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {uni.fees?.tuition || 'Contact us'}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {uni.courses?.[0] || 'Undergraduate'}
                  </span>
                </div>
                <Link
                  href={`/universities/${uni._id}`}
                  className="inline-flex items-center gap-2 text-accent-600 font-semibold text-sm hover:text-accent-700 transition-colors group/link"
                >
                  View Details
                  <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link
            href="/universities"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-900 text-white rounded-xl font-semibold hover:bg-primary-800 transition-all hover:scale-105 shadow-lg"
          >
            View All Universities
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
