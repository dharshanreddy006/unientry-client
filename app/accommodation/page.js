'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/apiConfig';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useSettings } from '@/components/providers/SettingsProvider';

export default function AccommodationPage() {
  const settings = useSettings();
  const [accommodations, setAccommodations] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedUni, setSelectedUni] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uniSearch, setUniSearch] = useState('');
  const [isSearching, setIsSearching] = useState(true);

  // Fetch all universities for selection
  useEffect(() => {
    const fetchUnis = async () => {
      try {
        const res = await fetch(`${API_URL}/universities`);
        const data = await res.json();
        if (data.success) setUniversities(data.data);
      } catch (err) { console.error(err); }
    };
    fetchUnis();
  }, []);

  // Fetch accommodations when a university is selected
  useEffect(() => {
    if (selectedUni) {
      const fetchAcc = async () => {
        setLoading(true);
        try {
          const res = await fetch(`${API_URL}/accommodations?universityId=${selectedUni.id}`);
          const data = await res.json();
          if (data.success) setAccommodations(data.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
      };
      fetchAcc();
      setIsSearching(false);
    }
  }, [selectedUni]);

  const filteredUnis = universities.filter(uni => 
    uni.universityName.toLowerCase().includes(uniSearch.toLowerCase()) ||
    uni.city.toLowerCase().includes(uniSearch.toLowerCase()) ||
    uni.country.toLowerCase().includes(uniSearch.toLowerCase())
  );

  const whatsappLink = `https://wa.me/${settings?.whatsappNumber}?text=Hi%20UniEntry!%20I%20want%20to%20list%20my%20accommodation%20property.`;

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Student Accommodations
          </div>
          <h1 className="font-heading font-bold text-4xl md:text-6xl text-slate-900 mb-6 leading-tight">
            Find Your <span className="text-blue-600">Home Away</span> From Home
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto mb-10 text-lg">
            Safe, comfortable, and affordable housing options near top universities worldwide.
          </p>

          {isSearching ? (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="relative group">
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search your university..."
                  value={uniSearch}
                  onChange={(e) => setUniSearch(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 rounded-3xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-base shadow-xl shadow-blue-900/5"
                />
              </div>

              {uniSearch && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden animate-slide-up max-h-96 overflow-y-auto">
                  {filteredUnis.length > 0 ? (
                    filteredUnis.map(uni => (
                      <button
                        key={uni.id}
                        onClick={() => setSelectedUni(uni)}
                        className="w-full px-6 py-4 text-left hover:bg-slate-50 border-b border-slate-50 last:border-0 flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{uni.universityName}</div>
                          <div className="text-xs text-slate-400">{uni.city}, {uni.country}</div>
                        </div>
                        <svg className="w-5 h-5 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))
                  ) : (
                    <div className="px-6 py-8 text-slate-400 text-sm italic">No universities found matching "{uniSearch}"</div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white border border-blue-100 shadow-sm">
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Viewing results for</p>
                  <p className="font-bold text-slate-900">{selectedUni.universityName}</p>
                </div>
                <button 
                  onClick={() => { setSelectedUni(null); setIsSearching(true); setUniSearch(''); }}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      {!isSearching && (
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Sidebar/CTA */}
              <div className="lg:w-1/3">
                <div className="sticky top-32 space-y-6">
                  <div className="bg-primary-900 rounded-3xl p-8 text-white shadow-2xl shadow-primary-900/20 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                    <h3 className="font-heading font-bold text-2xl mb-4 relative">Add Your Property</h3>
                    <p className="text-white/70 text-sm mb-8 leading-relaxed relative">
                      Are you a property owner or a service provider? List your student accommodation on UniEntry Global and reach thousands of students.
                    </p>
                    <a 
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-green-500/30"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      List via WhatsApp
                    </a>
                  </div>

                  <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-4">Why Book With Us?</h4>
                    <ul className="space-y-4">
                      {[
                        { title: 'Verified Properties', desc: 'Every listing is checked for safety and quality.' },
                        { title: 'No Hidden Costs', desc: 'Transparent pricing with all bills included options.' },
                        { title: 'Student Community', desc: 'Live with fellow students from around the world.' }
                      ].map((item, i) => (
                        <li key={i} className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 leading-tight">{item.title}</p>
                            <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* List */}
              <div className="lg:w-2/3">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-slate-400 font-medium animate-pulse">Finding the best rooms for you...</p>
                  </div>
                ) : accommodations.length > 0 ? (
                  <div className="space-y-6 animate-fade-in">
                    {accommodations.map((acc) => (
                      <div 
                        key={acc._id}
                        className="group bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 flex flex-col md:flex-row gap-8"
                      >
                        {/* Image Placeholder */}
                        <div className="md:w-56 h-48 md:h-auto rounded-2xl bg-slate-100 flex-shrink-0 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                          {acc.imageUrl ? (
                            <img src={acc.imageUrl} alt={acc.propertyName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-blue-600 uppercase tracking-wider shadow-sm">
                              {acc.roomType}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-heading font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                                  {acc.propertyName}
                                </h3>
                                <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {acc.location}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider leading-none mb-1">Starts From</p>
                                <p className="text-2xl font-black text-blue-600 leading-none">{acc.price}</p>
                              </div>
                            </div>

                            <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                              {acc.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                              <div className="px-3 py-1.5 bg-slate-50 rounded-xl text-xs font-medium text-slate-600 flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                {acc.distance}
                              </div>
                              {acc.amenities?.slice(0, 3).map((amenity, i) => (
                                <div key={i} className="px-3 py-1.5 bg-slate-50 rounded-xl text-xs font-medium text-slate-600">
                                  • {amenity}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Now</span>
                            </div>
                            <a 
                              href={`https://wa.me/${settings?.whatsappNumber}?text=Hi%20UniEntry!%20I'm%20interested%20in%20the%20property%20"${acc.propertyName}"%20near%20${selectedUni.universityName}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                            >
                              Check Availability
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-[40px] p-12 text-center border border-slate-100 shadow-sm animate-fade-in">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">No properties listed yet</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-8">
                      We haven't added accommodation listings for this university yet. Contact us for personalized help!
                    </p>
                    <a 
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-all shadow-xl shadow-green-500/20"
                    >
                      Inquire via WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Default view when no uni selected */}
      {isSearching && !uniSearch && (
        <section className="pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Verified Property', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                { title: 'Student Safe', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                { title: 'Direct WhatsApp', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' }
              ].map((item, i) => (
                <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
