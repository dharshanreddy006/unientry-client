'use client';

import { useState, useEffect } from 'react';
import { API_URL, getImageUrl } from '@/lib/apiConfig';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useSettings } from '@/components/providers/SettingsProvider';

const isVideoUrl = (url) => {
  if (typeof url !== 'string') return false;
  const lowerUrl = url.toLowerCase();
  return (
    lowerUrl.endsWith('.mp4') || 
    lowerUrl.endsWith('.webm') || 
    lowerUrl.endsWith('.ogg') || 
    lowerUrl.endsWith('.mov') || 
    lowerUrl.includes('/video')
  );
};

function AccommodationCard({ acc, settings, selectedUni, onOpenDetails }) {
  let images = [];
  if (acc.imageUrl) {
    if (Array.isArray(acc.imageUrl)) {
      images = acc.imageUrl;
    } else if (typeof acc.imageUrl === 'string') {
      if (acc.imageUrl.startsWith('[')) {
        try {
          images = JSON.parse(acc.imageUrl);
        } catch (e) {
          images = [acc.imageUrl];
        }
      } else if (acc.imageUrl.includes(',')) {
        images = acc.imageUrl.split(',').map(s => s.trim()).filter(Boolean);
      } else {
        images = [acc.imageUrl];
      }
    }
  }

  const coverImage = images[0] || '';
  const ownerNumber = (acc.ownerPhone && acc.ownerPhone.trim()) ? acc.ownerPhone.trim() : (settings?.whatsappNumber || '919876543210');
  const whatsappText = `Hi! I saw your property "${acc.propertyName}" on UniEntry Global and I'm interested in learning more about its availability.`;
  const whatsappLink = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="group bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col sm:flex-row gap-6">
      {/* Cover Image */}
      <div className="sm:w-48 h-44 rounded-2xl bg-slate-100 flex-shrink-0 relative overflow-hidden">
        {coverImage ? (
          isVideoUrl(coverImage) ? (
            <video src={getImageUrl(coverImage)} className="w-full h-full object-cover" muted loop playsInline autoPlay />
          ) : (
            <img src={getImageUrl(coverImage)} alt={acc.propertyName} className="w-full h-full object-cover" />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <span className="px-2.5 py-0.5 bg-white/95 backdrop-blur-sm rounded-lg text-[9px] font-bold text-blue-600 uppercase tracking-wider shadow-sm w-fit">
            {acc.propertyType || 'Apartment'}
          </span>
          <span className="px-2.5 py-0.5 bg-slate-900/90 text-white backdrop-blur-sm rounded-lg text-[9px] font-medium uppercase tracking-wider shadow-sm w-fit">
            {acc.roomType}
          </span>
        </div>
      </div>

      {/* Main Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                {acc.propertyName}
              </h3>
              {acc.googleMapLink ? (
                <a 
                  href={acc.googleMapLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs mt-1 font-medium transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {acc.location} <span className="text-[9px] text-blue-500 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded font-bold">📍 View Map</span>
                </a>
              ) : (
                <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {acc.location}
                </div>
              )}
              {acc.detailedLocation && (
                <p className="text-[11px] text-slate-500 mt-1 italic">{acc.detailedLocation}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider leading-none mb-1">Pricing</p>
              {acc.priceMonthly || acc.priceYearly ? (
                <div className="flex flex-col items-end gap-0.5">
                  {acc.priceMonthly && (
                    <p className="text-lg font-black text-blue-600 leading-none">₹{acc.priceMonthly.toLocaleString()}<span className="text-[10px] text-slate-400 font-medium">/mo</span></p>
                  )}
                  {acc.priceYearly && (
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">₹{acc.priceYearly.toLocaleString()}<span className="text-[9px] text-slate-400">/yr</span></p>
                  )}
                </div>
              ) : (
                <p className="text-lg font-black text-blue-600 leading-none">{acc.price}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 mb-4">
            <div className="px-2.5 py-1 bg-slate-50 rounded-lg text-[10px] font-medium text-slate-500 flex items-center gap-1">
              <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {acc.distance}
            </div>
            {acc.price && (
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 ${
                acc.price.toLowerCase().includes('without ac') || acc.price.toLowerCase().includes('non-ac')
                  ? 'bg-amber-50 text-amber-600 border border-amber-100/30'
                  : acc.price.toLowerCase().includes('with ac') || acc.price.toLowerCase().includes('ac')
                  ? 'bg-sky-50 text-sky-600 border border-sky-100/30'
                  : acc.price.toLowerCase().includes('everything')
                  ? 'bg-purple-50 text-purple-600 border border-purple-100/30'
                  : 'bg-slate-50 text-slate-600 border border-slate-100/30'
              }`}>
                {acc.price.toLowerCase().includes('without ac') || acc.price.toLowerCase().includes('non-ac') ? '💨' : acc.price.toLowerCase().includes('with ac') || acc.price.toLowerCase().includes('ac') ? '❄️' : '✨'} {acc.price}
              </span>
            )}
            {acc.coLiving && (
              <span className="px-2.5 py-1 bg-purple-50 rounded-lg text-[10px] font-bold text-purple-600 flex items-center gap-1">
                👥 Co-Living
              </span>
            )}
            {acc.coupleFriendly && (
              <span className="px-2.5 py-1 bg-pink-50 rounded-lg text-[10px] font-bold text-pink-600 flex items-center gap-1">
                💖 Couple Friendly
              </span>
            )}
            <span className="px-2.5 py-1 bg-emerald-50 rounded-lg text-[10px] font-bold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Verified
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={() => onOpenDetails(acc)}
            className="px-4 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            More Details &rarr;
          </button>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10 active:scale-95 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Owner
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AccommodationPage() {
  const settings = useSettings();
  const [accommodations, setAccommodations] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedUni, setSelectedUni] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uniSearch, setUniSearch] = useState('');
  const [isSearching, setIsSearching] = useState(true);
  const [activeTab, setActiveTab] = useState('rooms');
  const [activeDetails, setActiveDetails] = useState(null);

  const [filterType, setFilterType] = useState('All');
  const [filterCoLiving, setFilterCoLiving] = useState('All');
  const [filterCoupleFriendly, setFilterCoupleFriendly] = useState('All');
  const [maxPrice, setMaxPrice] = useState(50000);
  const [priceType, setPriceType] = useState('monthly');
  const [filterOpen, setFilterOpen] = useState(false);

  // Fetch all universities for selection
  useEffect(() => {
    const fetchUnis = async () => {
      try {
        const res = await fetch(`${API_URL}/universities`, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
        const data = await res.json();
        if (data.success) setUniversities(data.data);
      } catch (err) { }
    };
    fetchUnis();
  }, []);

  // Fetch accommodations when a university is selected
  useEffect(() => {
    if (selectedUni) {
      const fetchAcc = async () => {
        setLoading(true);
        try {
          const res = await fetch(`${API_URL}/accommodations?universityId=${selectedUni.id}`, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
          const data = await res.json();
          if (data.success) setAccommodations(data.data);
        } catch (err) { }
        finally { setLoading(false); }
      };
      fetchAcc();
      setIsSearching(false);
    }
  }, [selectedUni]);

  // Adjust max price range when accommodations list or price frequency is changed
  useEffect(() => {
    if (accommodations.length > 0) {
      const prices = accommodations
        .map(acc => (priceType === 'monthly' ? acc.priceMonthly : acc.priceYearly))
        .filter(Boolean);
      if (prices.length > 0) {
        setMaxPrice(Math.max(...prices));
      } else {
        setMaxPrice(priceType === 'monthly' ? 50000 : 500000);
      }
    }
  }, [accommodations, priceType]);

  const filteredUnis = universities.filter(uni => 
    uni.universityName.toLowerCase().includes(uniSearch.toLowerCase()) ||
    uni.city.toLowerCase().includes(uniSearch.toLowerCase()) ||
    uni.country.toLowerCase().includes(uniSearch.toLowerCase())
  );

  // Filtered accommodations
  const filteredAccommodations = accommodations.filter(acc => {
    // Property Type
    if (filterType !== 'All' && (acc.propertyType || '').toLowerCase() !== filterType.toLowerCase()) {
      return false;
    }
    // Co-Living
    if (filterCoLiving === 'Yes' && !acc.coLiving) return false;
    if (filterCoLiving === 'No' && acc.coLiving) return false;

    // Couple Friendly
    if (filterCoupleFriendly === 'Yes' && !acc.coupleFriendly) return false;
    if (filterCoupleFriendly === 'No' && acc.coupleFriendly) return false;

    // Price Filter
    const val = priceType === 'monthly' ? acc.priceMonthly : acc.priceYearly;
    if (val && val > maxPrice) return false;

    return true;
  });

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
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search your university..."
                  value={uniSearch}
                  onChange={(e) => setUniSearch(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 rounded-3xl glass-search text-slate-800 placeholder-slate-400 outline-none transition-all text-base"
                />
              </div>

              {uniSearch && (
                <div className="glass-panel rounded-3xl overflow-hidden animate-slide-up max-h-96 overflow-y-auto">
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
            
            {/* Tab Selector for Mobile / Tablet */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 lg:hidden shadow-inner max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('rooms')}
                className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all duration-300 ${activeTab === 'rooms' ? 'bg-white text-blue-600 shadow-sm scale-[1.02]' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Available Rooms
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all duration-300 ${activeTab === 'list' ? 'bg-white text-blue-600 shadow-sm scale-[1.02]' : 'text-slate-500 hover:text-slate-800'}`}
              >
                List Your Property
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
              {/* Sidebar/CTA — hidden on mobile when viewing rooms tab */}
              <div className={`lg:w-1/3 ${activeTab === 'list' ? 'block' : 'hidden lg:block'}`}>
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
              <div className={`lg:w-2/3 ${activeTab === 'rooms' ? 'block' : 'hidden lg:block'}`}>
                
                {/* Dynamic Search & Filter Bar */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm mb-6 sticky top-24 z-30">
                  {/* Filter Header — always visible */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z" />
                      </svg>
                      Filter Accommodations
                      {(filterType !== 'All' || filterCoLiving !== 'All' || filterCoupleFriendly !== 'All') && (
                        <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[9px] font-black uppercase">Active</span>
                      )}
                    </h4>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          setFilterType('All');
                          setFilterCoLiving('All');
                          setFilterCoupleFriendly('All');
                          setPriceType('monthly');
                          const prices = accommodations.map(acc => acc.priceMonthly).filter(Boolean);
                          setMaxPrice(prices.length > 0 ? Math.max(...prices) : 50000);
                        }}
                        className="text-xs text-blue-600 hover:underline font-semibold hidden sm:block"
                      >
                        Reset
                      </button>
                      {/* Collapse toggle — only on mobile */}
                      <button
                        onClick={() => setFilterOpen(prev => !prev)}
                        className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-all"
                        aria-label="Toggle filters"
                      >
                        <svg className={`w-4 h-4 transition-transform duration-300 ${filterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Filter Controls — collapsible on mobile, always open on desktop */}
                  <div className={`p-5 space-y-4 ${filterOpen ? 'block' : 'hidden lg:block'}`}>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Property Type */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Property Type</label>
                      <select 
                        value={filterType} 
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 outline-none text-xs bg-slate-50 font-semibold text-slate-700"
                      >
                        <option value="All">All Types</option>
                        <option value="Flat">Flat</option>
                        <option value="Hostel">Hostel</option>
                        <option value="PG">PG</option>
                        <option value="Studio Apartment">Studio Apartment</option>
                      </select>
                    </div>

                    {/* Co Living */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Co-Living</label>
                      <select 
                        value={filterCoLiving} 
                        onChange={(e) => setFilterCoLiving(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 outline-none text-xs bg-slate-50 font-semibold text-slate-700"
                      >
                        <option value="All">Any Co-Living</option>
                        <option value="Yes">Co-Living Only</option>
                        <option value="No">Non Co-Living</option>
                      </select>
                    </div>

                    {/* Couple Friendly */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Couple Friendly</label>
                      <select 
                        value={filterCoupleFriendly} 
                        onChange={(e) => setFilterCoupleFriendly(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 outline-none text-xs bg-slate-50 font-semibold text-slate-700"
                      >
                        <option value="All">Any Status</option>
                        <option value="Yes">Couple Friendly Only</option>
                        <option value="No">Not Couple Friendly</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Price Type Switcher */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Price Frequency</label>
                      <div className="flex bg-slate-100 p-1 rounded-xl w-full max-w-[240px]">
                        <button
                          onClick={() => setPriceType('monthly')}
                          className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all ${priceType === 'monthly' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                          Monthly Price
                        </button>
                        <button
                          onClick={() => setPriceType('yearly')}
                          className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all ${priceType === 'yearly' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                          Yearly Price
                        </button>
                      </div>
                    </div>

                    {/* Price Range Slider */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Max Price Filter</label>
                        <span className="text-xs font-black text-blue-600">
                          ₹{maxPrice.toLocaleString()} {priceType === 'monthly' ? '/mo' : '/yr'}
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min={0} 
                        max={priceType === 'monthly' ? 100000 : 1000000} 
                        step={priceType === 'monthly' ? 1000 : 10000}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                  </div>{/* end collapsible filter controls */}
                </div>{/* end filter card */}

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-slate-400 font-medium animate-pulse">Finding the best rooms for you...</p>
                  </div>
                ) : filteredAccommodations.length > 0 ? (
                  <div className="space-y-6 custom-fade-in">
                    {filteredAccommodations.map((acc) => (
                      <AccommodationCard key={acc._id} acc={acc} settings={settings} selectedUni={selectedUni} onOpenDetails={setActiveDetails} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-[40px] p-12 text-center border border-slate-100 shadow-sm custom-fade-in">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">No matching properties found</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-8">
                      We couldn't find any listings that match your search filters. Try resetting the filters or tweaking your maximum price.
                    </p>
                    <button 
                      onClick={() => {
                        setFilterType('All');
                        setFilterCoLiving('All');
                        setFilterCoupleFriendly('All');
                        setPriceType('monthly');
                        const prices = accommodations.map(acc => acc.priceMonthly).filter(Boolean);
                        setMaxPrice(prices.length > 0 ? Math.max(...prices) : 50000);
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Details Modal Overlay */}
      {activeDetails && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm custom-fade-in">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden custom-scale-up">
            {/* Sticky Header with Close */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified Property
                </span>
              </div>
              <button 
                onClick={() => setActiveDetails(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Photos grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Property Gallery</h4>
                {(() => {
                  const imgs = Array.isArray(activeDetails.imageUrl) 
                    ? activeDetails.imageUrl 
                    : (activeDetails.imageUrl && activeDetails.imageUrl.startsWith('[') 
                        ? JSON.parse(activeDetails.imageUrl) 
                        : (activeDetails.imageUrl ? [activeDetails.imageUrl] : [])
                      );
                  return imgs.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {imgs.map((url, idx) => {
                        const isVid = isVideoUrl(url);
                        return (
                          <div 
                            key={idx} 
                            className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 cursor-zoom-in group relative shadow-sm"
                            onClick={() => window.open(url, '_blank')}
                          >
                            {isVid ? (
                              <video src={getImageUrl(url)} className="w-full h-full object-cover" controls onClick={(e) => e.stopPropagation()} />
                            ) : (
                              <img src={getImageUrl(url)} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-12 bg-slate-50 rounded-2xl text-center text-slate-400 text-sm">No photos available</div>
                  );
                })()}
              </div>

              {/* Title & Stats */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="font-heading font-black text-2xl text-slate-900 mb-1">{activeDetails.propertyName}</h3>
                <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {activeDetails.location}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Property Type</p>
                    <p className="text-sm font-bold text-slate-800">{activeDetails.propertyType || 'Apartment'}</p>
                  </div>
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Pricing (Monthly)</p>
                    {activeDetails.priceMonthly ? (
                      <p className="text-sm font-black text-blue-600">₹{activeDetails.priceMonthly.toLocaleString()}/mo</p>
                    ) : (
                      <p className="text-sm font-black text-blue-600">{activeDetails.price}</p>
                    )}
                  </div>
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Distance</p>
                    <p className="text-sm font-bold text-slate-800">{activeDetails.distance}</p>
                  </div>
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Room Setup</p>
                    <p className="text-sm font-bold text-slate-800">{activeDetails.roomType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Co-Living</p>
                    <p className="text-sm font-bold text-slate-800">{activeDetails.coLiving ? '👥 Yes' : '❌ No'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Couple Friendly</p>
                    <p className="text-sm font-bold text-slate-800">{activeDetails.coupleFriendly ? '💖 Yes' : '❌ No'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Tenant Preference</p>
                    <p className="text-sm font-bold text-slate-800">{activeDetails.genderPreference || 'Unisex'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Deposit Required</p>
                    <p className="text-sm font-bold text-slate-800">{activeDetails.depositAmount || 'None'}</p>
                  </div>
                </div>

                {activeDetails.price && (
                  <div className="mt-3 p-4 bg-blue-50/30 rounded-2xl border border-blue-100/30 text-left flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AC / Furnishing Option</span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide ${
                      activeDetails.price.toLowerCase().includes('without ac') || activeDetails.price.toLowerCase().includes('non-ac')
                        ? 'bg-amber-100 text-amber-700'
                        : activeDetails.price.toLowerCase().includes('with ac') || activeDetails.price.toLowerCase().includes('ac')
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {activeDetails.price}
                    </span>
                  </div>
                )}

                {activeDetails.detailedLocation && (
                  <div className="mt-3 p-4 bg-amber-50/40 rounded-2xl border border-amber-100/40 text-left">
                    <p className="text-[10px] text-amber-600 uppercase font-bold tracking-wider mb-1">Exact Address / Location</p>
                    <p className="text-sm font-medium text-slate-700">{activeDetails.detailedLocation}</p>
                  </div>
                )}

                {activeDetails.googleMapLink && (
                  <div className="mt-3 p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/30 text-left flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider mb-0.5">Google Maps Location</p>
                      <p className="text-xs text-slate-500 font-medium">View coordinates and directions</p>
                    </div>
                    <a 
                      href={activeDetails.googleMapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10 flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L16 4m0 13V4m-6 3l6-3" />
                      </svg>
                      Open Google Maps
                    </a>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">About this property</h4>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{activeDetails.description}</p>
              </div>

              {/* Amenities */}
              {activeDetails.amenities && activeDetails.amenities.length > 0 && (
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeDetails.amenities.map((amenity, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold border border-slate-100">
                        ✓ {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Bottom Actions */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-slate-100 flex gap-3">
              {(() => {
                const ownerNum = (activeDetails.ownerPhone && activeDetails.ownerPhone.trim()) ? activeDetails.ownerPhone.trim() : (settings?.whatsappNumber || '919876543210');
                const text = `Hi! I saw your property "${activeDetails.propertyName}" on UniEntry Global and I'm interested in renting/viewing it. Please let me know the details.`;
                const link = `https://wa.me/${ownerNum}?text=${encodeURIComponent(text)}`;
                return (
                  <a 
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-center text-sm shadow-xl shadow-emerald-600/20 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Check Availability on WhatsApp
                  </a>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .custom-fade-in {
          animation: fadeIn 0.25s ease-out forwards;
        }
        .custom-scale-up {
          animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

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
