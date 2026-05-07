'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

function UniversitiesContent() {
  const searchParams = useSearchParams();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    country: searchParams.get('country') || '',
    degreeType: '',
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchUniversities = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filters.country) params.append('country', filters.country);
      if (filters.degreeType) params.append('degreeType', filters.degreeType);
      params.append('page', page);
      params.append('limit', 12);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://unientry-server-production.up.railway.app/api'}/universities?${params}`
      );
      const data = await res.json();
      if (data.success) {
        setUniversities(data.data);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Error fetching universities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUniversities();
  };

  const countries = ['Germany', 'UK', 'USA', 'Canada', 'Australia'];
  const degreeTypes = ['Undergraduate', 'Postgraduate', 'Doctorate', 'Diploma'];

  return (
    <main>
      <Navbar />

      {/* Hero banner */}
      <section className="hero-gradient pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
            Explore Universities
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Browse our curated list of top universities from around the world
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search universities, countries, or courses..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:bg-white/15 focus:border-accent-400 outline-none transition-all text-sm backdrop-blur-sm"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-accent-500 text-white rounded-2xl font-semibold hover:bg-accent-600 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Filter bar */}
          <div className="flex flex-wrap gap-3 mb-8">
            {/* Country filter */}
            <select
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:border-accent-400 outline-none cursor-pointer"
            >
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Degree type filter */}
            <select
              value={filters.degreeType}
              onChange={(e) => setFilters({ ...filters, degreeType: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:border-accent-400 outline-none cursor-pointer"
            >
              <option value="">All Degrees</option>
              {degreeTypes.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Clear */}
            {(filters.country || filters.degreeType) && (
              <button
                onClick={() => setFilters({ country: '', degreeType: '' })}
                className="px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm hover:bg-red-100 transition-colors"
              >
                Clear Filters ✕
              </button>
            )}

            <div className="ml-auto text-sm text-gray-400 flex items-center">
              {pagination.total} universities found
            </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-accent-200 border-t-accent-500 rounded-full animate-spin" />
            </div>
          ) : universities.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No universities found matching your criteria.</p>
              <button
                onClick={() => { setSearch(''); setFilters({ country: '', degreeType: '' }); }}
                className="mt-4 text-accent-600 font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* University grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {universities.map((uni) => (
                  <Link
                    key={uni._id}
                    href={`/universities/${uni._id}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 card-hover border border-gray-100"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={uni.coverImage?.url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=600'}
                        alt={uni.universityName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary-900">
                        {uni.country}
                      </div>
                      {uni.featured && (
                        <div className="absolute top-3 left-3 bg-accent-500 px-3 py-1 rounded-full text-xs font-semibold text-white">
                          ⭐ Featured
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading font-semibold text-lg text-primary-900 mb-2 group-hover:text-accent-600 transition-colors">
                        {uni.universityName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {uni.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {uni.duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-accent-600 font-bold text-sm">{uni.fees?.tuition}</span>
                        <span className="text-accent-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          View Details
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pagination.pages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => fetchUniversities(i + 1)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                        pagination.page === i + 1
                          ? 'bg-accent-500 text-white shadow-lg'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function UniversitiesPage() {
  return (
    <Suspense fallback={
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="w-10 h-10 border-4 border-accent-200 border-t-accent-500 rounded-full animate-spin" />
        </div>
      </main>
    }>
      <UniversitiesContent />
    </Suspense>
  );
}
