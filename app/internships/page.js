'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function InternshipsPage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (typeFilter) params.append('type', typeFilter);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/internships?${params}`
      );
      const data = await res.json();
      if (data.success) setInternships(data.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInternships(); }, [typeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
            Internship Opportunities
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Kickstart your career with top internship opportunities worldwide
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by company or role..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:bg-white/15 focus:border-accent-400 outline-none transition-all text-sm"
              />
            </div>
            <button type="submit" className="px-8 py-4 bg-accent-500 text-white rounded-2xl font-semibold hover:bg-accent-600 transition-colors">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Listing */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {['', 'Remote', 'On-site', 'Hybrid'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  typeFilter === type
                    ? 'bg-accent-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {type || 'All Types'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-accent-200 border-t-accent-500 rounded-full animate-spin" />
            </div>
          ) : internships.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No internships found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {internships.map((intern) => (
                <Link
                  key={intern._id}
                  href={`/internships/${intern._id}`}
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 card-hover"
                >
                  {/* Company logo placeholder */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-4">
                    <span className="font-heading font-bold text-xl text-primary-700">
                      {intern.companyName.charAt(0)}
                    </span>
                  </div>

                  <h3 className="font-heading font-semibold text-lg text-primary-900 mb-1 group-hover:text-accent-600 transition-colors">
                    {intern.role}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">{intern.companyName}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">
                      ⏱ {intern.duration}
                    </span>
                    <span className="px-3 py-1 bg-green-50 rounded-lg text-xs text-green-700">
                      💰 {intern.stipend}
                    </span>
                    <span className="px-3 py-1 bg-accent-50 rounded-lg text-xs text-accent-700">
                      📍 {intern.type}
                    </span>
                  </div>

                  <span className="text-accent-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
