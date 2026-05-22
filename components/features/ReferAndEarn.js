'use client';

import { useState, useEffect } from 'react';
import { API_URL, getImageUrl } from '@/lib/apiConfig';
import Link from 'next/link';

export default function ReferAndEarn() {
  const [universities, setUniversities] = useState([]);
  const [settings, setSettings] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUni, setSelectedUni] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Universities
    fetch(`${API_URL}/universities`, { cache: 'no-store', signal: AbortSignal.timeout(1500) })
      .then(res => res.json())
      .then(data => {
        setUniversities(data.data || data);
      })
      .catch(() => {});

    // Fetch Site Settings for WhatsApp Number
    fetch(`${API_URL}/settings`, { cache: 'no-store', signal: AbortSignal.timeout(1500) })
      .then(res => res.json())
      .then(data => {
        if (data.success) setSettings(data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const filteredUnis = searchQuery.trim() === '' 
    ? [] 
    : (Array.isArray(universities) ? universities : []).filter(uni => 
        uni?.universityName?.toLowerCase().trim().includes(searchQuery.toLowerCase().trim())
      ).slice(0, 5);

  return (
    <section className="section-padding bg-gray-50 relative overflow-hidden" id="refer-and-earn">
      {/* Decorative background circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/5 rounded-full -mr-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/5 rounded-full -ml-48 -mb-48 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-black mb-4 tracking-widest uppercase">
            EARN WHILE YOU LEARN
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary-900 mb-4">
            Refer an Admission & <span className="text-green-600 font-black">Earn Rewards</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Help your friends find their dream university and get rewarded for every successful admission. Search any university to see the referral rewards.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Search Box */}
          <div className="relative mb-12">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search university to see referral rewards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-8 py-6 rounded-[2.5rem] bg-white border-2 border-gray-100 text-primary-900 placeholder:text-gray-300 focus:border-green-500 focus:ring-8 focus:ring-green-500/5 outline-none transition-all shadow-xl text-lg"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Results dropdown */}
            {searchQuery.trim().length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl z-50 animate-slide-down">
                {filteredUnis.length > 0 ? (
                  filteredUnis.map(uni => (
                    <button
                      key={uni._id}
                      onClick={() => { setSelectedUni(uni); setSearchQuery(''); }}
                      className="w-full px-8 py-6 flex items-center gap-5 hover:bg-green-50 transition-colors border-b border-gray-50 last:border-0 text-left"
                    >
                      <img 
                        src={getImageUrl(uni?.coverImage?.url) || 'https://images.unsplash.com/photo-1562774053-701939374585?w=100'} 
                        className="w-14 h-14 rounded-2xl object-cover shadow-sm" 
                        alt="" 
                      />
                      <div>
                        <p className="text-primary-900 font-bold text-lg">{uni.universityName}</p>
                        <p className="text-green-600 text-sm font-bold uppercase tracking-wider">
                          {uni.referAndEarn ? 'Reward Available' : 'No reward listed'}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-8 py-10 text-center text-gray-400">
                    No university found matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Display Card */}
          {selectedUni && (
            <div className="animate-fade-in bg-white rounded-[3.5rem] border-2 border-green-500 shadow-2xl shadow-green-500/10 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-2 relative h-64 md:h-full min-h-[300px]">
                  <img 
                    src={getImageUrl(selectedUni?.coverImage?.url) || 'https://images.unsplash.com/photo-1562774053-701939374585?w=600'} 
                    className="w-full h-full object-cover" 
                    alt={selectedUni.universityName} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1 opacity-70">Referring</p>
                    <h4 className="text-xl font-black">{selectedUni.universityName}</h4>
                  </div>
                </div>
                
                <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-xs font-black uppercase tracking-widest mb-6 mx-auto md:mx-0">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    REFERRAL REWARD
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-black text-primary-900 mb-4 tracking-tighter">
                    {selectedUni.referAndEarn || 'Contact Admin for Details'}
                  </h3>
                  
                  <p className="text-gray-500 text-lg mb-8 font-medium">
                    Earn this reward for every student you refer who successfully takes admission at {selectedUni.universityName}.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href={`https://wa.me/${settings?.whatsappNumber || '919876543210'}?text=Hi UniEntry! I want to refer a student to ${selectedUni.universityName}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-8 py-4 bg-green-500 text-white rounded-2xl font-black text-center shadow-lg shadow-green-500/30 hover:-translate-y-1 transition-all"
                    >
                      REFER NOW
                    </a>
                    <Link 
                      href={`/universities/${selectedUni._id || selectedUni.id}`}
                      className="flex-1 px-8 py-4 bg-gray-100 text-primary-900 rounded-2xl font-black text-center hover:bg-gray-200 transition-all"
                    >
                      VIEW PROFILE
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!selectedUni && !searchQuery && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40">
              <div className="p-8 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center italic">
                <p className="text-gray-400">Search a university to see how much you can earn...</p>
              </div>
              <div className="p-8 rounded-[2rem] border-2 border-dashed border-gray-200 hidden md:flex flex-col items-center justify-center text-center italic">
                <p className="text-gray-400">Refer & Earn details will appear here...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
