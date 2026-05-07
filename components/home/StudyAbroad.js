'use client';

import Link from 'next/link';

const countries = [
  {
    name: 'Germany',
    flag: '🇩🇪',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600',
    description: 'Low tuition fees, world-class engineering programs, and post-study work opportunities.',
    color: 'from-yellow-400/20 to-red-500/20',
  },
  {
    name: 'UK',
    flag: '🇬🇧',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600',
    description: 'Prestigious universities, shorter degree programs, and diverse cultural experience.',
    color: 'from-blue-400/20 to-red-400/20',
  },
  {
    name: 'USA',
    flag: '🇺🇸',
    image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=600',
    description: 'Top-ranked universities, extensive research opportunities, and campus life like no other.',
    color: 'from-blue-500/20 to-red-500/20',
  },
  {
    name: 'Canada',
    flag: '🇨🇦',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=600',
    description: 'Affordable education, welcoming immigration policies, and excellent quality of life.',
    color: 'from-red-400/20 to-white/20',
  },
  {
    name: 'Australia',
    flag: '🇦🇺',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600',
    description: 'Innovative universities, vibrant lifestyle, and strong support for international students.',
    color: 'from-blue-500/20 to-yellow-400/20',
  },
  {
    name: 'India',
    flag: '🇮🇳',
    image: 'https://images.unsplash.com/photo-1524492707947-2f85a64b67ad?w=600',
    description: 'Rapidly growing education sector, diverse culture, and emerging opportunities in tech and research.',
    color: 'from-orange-400/20 to-green-500/20',
  },
];

export default function StudyAbroad() {
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
          {countries.map((country, index) => (
            <Link
              key={country.name}
              href={`/universities?country=${country.name}`}
              className={`group relative overflow-hidden rounded-2xl card-hover ${
                index < 2 ? 'sm:col-span-1 lg:col-span-1' : ''
              } ${index === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="relative h-72">
                <img
                  src={country.image}
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
