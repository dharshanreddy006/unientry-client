'use client';

import { useState } from 'react';
import { API_URL, getImageUrl } from '@/lib/apiConfig';
import { useSettings } from '@/components/providers/SettingsProvider';

const VEHICLE_TYPES = ['Bike', 'Car'];

export default function RentAndRide() {
  const [universities, setUniversities] = useState([]);
  const settings = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUni, setSelectedUni] = useState(null);
  const [activeTab, setActiveTab] = useState('rent');
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [loadingUnis, setLoadingUnis] = useState(false);
  const [selectedType, setSelectedType] = useState('All');

  // List form
  const [listForm, setListForm] = useState({ vehicleName: '', description: '', price: '', vehicleType: 'Bike', availableHours: '', providerName: '' });

  const filteredUnis = searchQuery.trim().length > 1
    ? (universities).filter(u => u?.universityName?.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.trim().length > 1 && universities.length === 0) {
      setLoadingUnis(true);
      try {
        const res = await fetch(`${API_URL}/universities?limit=200`, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
        const data = await res.json();
        setUniversities(data.data || []);
      } catch (e) {}
      setLoadingUnis(false);
    }
  };

  const handleSelectUni = async (uni) => {
    setSelectedUni(uni);
    setSearchQuery('');
    setActiveTab('rent');
    setSelectedType('All');
    fetchListings(uni.id || uni._id);
  };

  const fetchListings = async (uniId) => {
    setLoadingListings(true);
    try {
      const res = await fetch(`${API_URL}/rent-and-rides?universityId=${uniId}`, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
      const data = await res.json();
      setListings(data.data || []);
    } catch (e) { setListings([]); }
    setLoadingListings(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedType('All');
    if (selectedUni && tab === 'rent') fetchListings(selectedUni.id || selectedUni._id);
  };

  const getWaNumber = () => settings?.whatsappNumber || '918121665671';

  const handleListWhatsApp = () => {
    const { vehicleName, description, price, vehicleType, availableHours, providerName } = listForm;
    if (!vehicleName || !description) return alert('Please fill in at least the vehicle name and description.');
    const uniName = selectedUni.universityName;
    const msg = `Hi UniEntry! I want to list my vehicle for rent at *${uniName}*.\n\n*Vehicle:* ${vehicleName}\n*Type:* ${vehicleType}\n*Price:* ${price || 'Negotiable'}\n*Available For:* ${availableHours} hours\n*Description:* ${description}\n*Provider Name:* ${providerName || 'Anonymous'}\n\nPlease add this to Rent & Ride.`;
    window.open(`https://wa.me/${getWaNumber()}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleRentWhatsApp = (listing) => {
    const msg = `Hi UniEntry! I am interested in renting the *"${listing.vehicleName}"* listed at *${selectedUni.universityName}*.\n\n*Price:* ${listing.price}\n\nPlease connect me with the provider.`;
    window.open(`https://wa.me/${getWaNumber()}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const filteredListings = selectedType === 'All'
    ? listings
    : listings.filter(l => l.vehicleType === selectedType);

  return (
    <section className="section-padding relative overflow-hidden bg-slate-50 min-h-[60vh] flex items-center justify-center" id="rent-and-ride">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[130px] -mr-64 -mt-64 pointer-events-none" style={{background: 'rgba(16, 185, 129, 0.08)'}} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[130px] -ml-64 -mb-64 pointer-events-none" style={{background: 'rgba(5, 150, 105, 0.08)'}} />

      <div className="max-w-xl mx-auto px-4 text-center relative z-10">
        {/* Animated Icon */}
        <div className="w-24 h-24 rounded-[2rem] bg-emerald-50 border border-emerald-100/50 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/5 relative group">
          <div className="absolute inset-0 rounded-[2rem] bg-emerald-500/10 animate-ping opacity-75" />
          <span className="text-5xl relative z-10 transition-transform duration-500 group-hover:scale-110">🛵</span>
        </div>

        {/* Badge */}
        <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 border bg-emerald-50 text-emerald-600 border-emerald-200/50 shadow-sm animate-pulse">
          COMING SOON
        </span>

        {/* Title */}
        <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 mb-4 tracking-tight">
          Rent & Ride is <span className="text-emerald-600">On The Way!</span>
        </h2>

        {/* Description */}
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          We are currently preparing our Rent & Ride fleet to launch on your campus. Soon, you'll be able to rent verified bikes and cars on-demand, or list your own vehicle to earn extra income!
        </p>

        {/* CTA Card */}
        <div className="bg-white/80 backdrop-blur-md border border-emerald-100/30 rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-slate-100 mb-6">
          <h4 className="text-slate-800 font-bold text-sm sm:text-base mb-2">Be the first to know when we launch</h4>
          <p className="text-slate-400 text-xs mb-6">Join the campus waitlist and receive early access benefits.</p>
          
          <button
            onClick={() => {
              const msg = `Hi UniEntry! I am interested in the Rent & Ride service. Please notify me when it launches at my campus!`;
              window.open(`https://wa.me/${getWaNumber()}?text=${encodeURIComponent(msg)}`, '_blank');
            }}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/20"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.012 2c-5.508 0-9.987 4.479-9.987 9.987 0 1.763.463 3.421 1.264 4.847l-1.341 4.904 5.018-1.315c1.403.763 3.007 1.197 4.712 1.197 5.508 0 9.988-4.479 9.988-9.987 0-5.508-4.48-9.987-9.988-9.987zm4.847 14.239c-.198.558-1.173 1.056-1.612 1.121-.401.059-.803.109-2.26-.479-1.856-.75-3.053-2.645-3.147-2.771-.095-.126-.772-.962-.772-1.836 0-.875.458-1.303.621-1.482.162-.179.356-.224.474-.224h.339c.109 0 .254-.041.396.302.147.356.502 1.221.545 1.31.042.089.071.192.012.31-.059.118-.089.191-.176.295-.089.103-.186.23-.265.308-.103.103-.209.215-.09.422.118.207.525.867 1.128 1.403.777.689 1.432.905 1.639.992.207.086.331.074.455-.068.125-.141.534-.622.676-.835.142-.213.284-.179.479-.107s1.242.585 1.454.693c.213.108.356.161.409.253.054.093.054.538-.145 1.096z"/>
            </svg>
            Join Waitlist via WhatsApp
          </button>
        </div>

        {/* Back Link */}
        <button
          onClick={() => window.history.back()}
          className="text-slate-400 hover:text-slate-600 text-xs font-semibold flex items-center justify-center gap-1.5 mx-auto transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>
      </div>
    </section>
  );

  return (
    <section className="section-padding relative overflow-hidden bg-emerald-50/50" id="rent-and-ride">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[150px] -mr-64 -mt-64 pointer-events-none" style={{background: 'rgba(16, 185, 129, 0.1)'}} />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[150px] -ml-64 -mb-64 pointer-events-none" style={{background: 'rgba(52, 211, 153, 0.15)'}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4 tracking-widest uppercase border" style={{background: 'rgba(16, 185, 129, 0.08)', color: '#059669', borderColor: 'rgba(16, 185, 129, 0.2)'}}>
            RENT & RIDE
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-slate-900 mb-4">
            Rent a <span style={{color: '#059669'}}>Bike or Car</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Need a ride for a few hours? Or have a vehicle to rent out? Connect with peers on your campus instantly.
          </p>
        </div>

        {/* University Search */}
        <div className="max-w-3xl mx-auto mb-10 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search your university to find rides..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="w-full px-8 py-6 rounded-[2rem] border border-emerald-100 text-slate-800 placeholder:text-slate-400 outline-none transition-all text-lg bg-white shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md bg-emerald-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Dropdown */}
          {searchQuery.trim().length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-emerald-100 rounded-[2rem] overflow-hidden shadow-2xl z-50">
              {loadingUnis ? (
                <div className="px-8 py-8 text-center">
                  <div className="w-6 h-6 border-2 border-gray-100 border-t-emerald-500 rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Searching universities...</p>
                </div>
              ) : filteredUnis.length > 0 ? (
                filteredUnis.map(uni => (
                  <button
                    key={uni.id || uni._id}
                    onClick={() => handleSelectUni(uni)}
                    className="w-full px-8 py-5 flex items-center gap-4 hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-0 text-left group"
                  >
                    <img
                      src={getImageUrl(uni?.coverImage?.url) || 'https://images.unsplash.com/photo-1562774053-701939374585?w=100'}
                      className="w-12 h-12 rounded-xl object-cover"
                      alt=""
                    />
                    <div>
                      <p className="text-slate-900 font-bold group-hover:text-emerald-600 transition-colors">{uni.universityName}</p>
                      <p className="text-slate-400 text-xs">{uni.city}, {uni.country}</p>
                    </div>
                    <div className="ml-auto text-slate-200 group-hover:text-emerald-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-8 py-10 text-center">
                  <p className="text-slate-400 text-sm">No university found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected University View */}
        {selectedUni ? (
          <div className="animate-fade-in">
            {/* University Header */}
            <div className="bg-white/80 backdrop-blur-md border border-emerald-100/50 rounded-[3rem] p-6 md:p-10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <img
                  src={getImageUrl(selectedUni?.coverImage?.url) || 'https://images.unsplash.com/photo-1562774053-701939374585?w=200'}
                  className="w-20 h-20 rounded-2xl object-cover shadow-xl"
                  alt=""
                />
                <div>
                  <h3 className="font-heading font-bold text-2xl md:text-3xl text-slate-900">{selectedUni.universityName}</h3>
                  <p className="text-slate-500 text-sm mt-1">{selectedUni.city}, {selectedUni.country}</p>
                </div>
              </div>
              <button
                onClick={() => { setSelectedUni(null); setListings([]); }}
                className="px-6 py-3 bg-white hover:bg-gray-50 text-slate-700 rounded-2xl text-sm font-bold transition-all border border-gray-200 shadow-sm self-start md:self-auto"
              >
                Change University
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={() => handleTabChange('rent')}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'rent' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                <span className="text-xl">🛵</span>
                Rent a Ride
              </button>
              <button
                onClick={() => handleTabChange('list')}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'list' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                <span className="text-xl">🔑</span>
                List Your Vehicle
              </button>
            </div>

            {/* RENT TAB */}
            {activeTab === 'rent' && (
              <div>
                {/* Filter */}
                <div className="flex gap-2 flex-wrap mb-8 justify-center">
                  {['All', ...VEHICLE_TYPES].map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${selectedType === type ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-50 border border-emerald-100'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {loadingListings ? (
                  <div className="text-center py-20">
                    <div className="w-8 h-8 border-2 border-gray-100 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">Finding rides...</p>
                  </div>
                ) : filteredListings.length === 0 ? (
                  <div className="text-center py-20 bg-emerald-50/50 rounded-[2rem] border border-dashed border-emerald-200">
                    <div className="text-5xl mb-4">🛴</div>
                    <p className="text-slate-400 font-medium text-lg">No vehicles available right now</p>
                    <p className="text-slate-300 text-xs mt-2 uppercase tracking-widest">Be the first to list yours at {selectedUni.universityName}!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map(listing => (
                      <div key={listing.id} className="bg-white border border-emerald-100 rounded-[2rem] overflow-hidden group hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col">
                        {listing.imageUrl ? (
                          <div className="h-48 overflow-hidden relative">
                            <img
                              src={getImageUrl(listing.imageUrl)}
                              alt={listing.vehicleName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {!listing.isAvailable && (
                               <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                                 <span className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg text-sm tracking-widest uppercase">Currently Rented</span>
                               </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-48 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-6xl relative">
                            {listing.vehicleType === 'Bike' ? '🛵' : '🚘'}
                            {!listing.isAvailable && (
                               <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                                 <span className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg text-sm tracking-widest uppercase">Currently Rented</span>
                               </div>
                            )}
                          </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h4 className="text-slate-900 font-bold text-lg leading-tight">{listing.vehicleName}</h4>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold whitespace-nowrap shrink-0">
                              {listing.price || 'Negotiable'}
                            </span>
                          </div>
                          <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">{listing.description}</p>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex flex-col">
                              <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">
                                {listing.vehicleType}
                              </span>
                              {listing.availableHours > 0 && listing.isAvailable && (
                                <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                  Avail: {listing.availableHours} Hrs
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleRentWhatsApp(listing)}
                              disabled={!listing.isAvailable}
                              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${listing.isAvailable ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 hover:scale-105' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.012 2c-5.508 0-9.987 4.479-9.987 9.987 0 1.763.463 3.421 1.264 4.847l-1.341 4.904 5.018-1.315c1.403.763 3.007 1.197 4.712 1.197 5.508 0 9.988-4.479 9.988-9.987 0-5.508-4.48-9.987-9.988-9.987zm4.847 14.239c-.198.558-1.173 1.056-1.612 1.121-.401.059-.803.109-2.26-.479-1.856-.75-3.053-2.645-3.147-2.771-.095-.126-.772-.962-.772-1.836 0-.875.458-1.303.621-1.482.162-.179.356-.224.474-.224h.339c.109 0 .254-.041.396.302.147.356.502 1.221.545 1.31.042.089.071.192.012.31-.059.118-.089.191-.176.295-.089.103-.186.23-.265.308-.103.103-.209.215-.09.422.118.207.525.867 1.128 1.403.777.689 1.432.905 1.639.992.207.086.331.074.455-.068.125-.141.534-.622.676-.835.142-.213.284-.179.479-.107s1.242.585 1.454.693c.213.108.356.161.409.253.054.093.054.538-.145 1.096z"/>
                              </svg>
                              {listing.isAvailable ? 'Rent Now' : 'Unavailable'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* LIST TAB */}
            {activeTab === 'list' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-emerald-50/30 border border-emerald-100 rounded-[2.5rem] p-6 md:p-10 shadow-sm">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-3xl">
                      🔑
                    </div>
                    <h4 className="text-slate-900 font-bold text-2xl mb-2">List Your Vehicle</h4>
                    <p className="text-slate-500 text-sm">Provide details about your bike or car. Once added by admin, it will be marked available for the hours you specify.</p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-slate-700 text-xs font-bold uppercase tracking-widest mb-2">Vehicle Name *</label>
                      <input
                        type="text"
                        placeholder="e.g., Honda Activa 6G, Maruti Swift"
                        value={listForm.vehicleName}
                        onChange={e => setListForm({ ...listForm, vehicleName: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white border border-emerald-100 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none transition-all shadow-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 text-xs font-bold uppercase tracking-widest mb-2">Vehicle Type</label>
                        <select
                          value={listForm.vehicleType}
                          onChange={e => setListForm({ ...listForm, vehicleType: e.target.value })}
                          className="w-full px-6 py-4 rounded-2xl bg-white border border-emerald-100 text-slate-800 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none transition-all shadow-sm"
                        >
                          {VEHICLE_TYPES.map(c => (
                            <option key={c} value={c} className="bg-white">{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-700 text-xs font-bold uppercase tracking-widest mb-2">Price</label>
                        <input
                          type="text"
                          placeholder="e.g., ₹50/hour"
                          value={listForm.price}
                          onChange={e => setListForm({ ...listForm, price: e.target.value })}
                          className="w-full px-6 py-4 rounded-2xl bg-white border border-emerald-100 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 text-xs font-bold uppercase tracking-widest mb-2">Available For (Hours) *</label>
                      <input
                        type="number"
                        placeholder="e.g., 24"
                        value={listForm.availableHours}
                        onChange={e => setListForm({ ...listForm, availableHours: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white border border-emerald-100 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none transition-all shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 text-xs font-bold uppercase tracking-widest mb-2">Description *</label>
                      <textarea
                        rows={4}
                        placeholder="Condition, rules, pickup point..."
                        value={listForm.description}
                        onChange={e => setListForm({ ...listForm, description: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white border border-emerald-100 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none transition-all shadow-sm resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 text-xs font-bold uppercase tracking-widest mb-2">Your Name (Optional)</label>
                      <input
                        type="text"
                        placeholder="Your name for the listing"
                        value={listForm.providerName}
                        onChange={e => setListForm({ ...listForm, providerName: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white border border-emerald-100 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none transition-all shadow-sm"
                      />
                    </div>

                    <button
                      onClick={handleListWhatsApp}
                      className="w-full py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/30"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.012 2c-5.508 0-9.987 4.479-9.987 9.987 0 1.763.463 3.421 1.264 4.847l-1.341 4.904 5.018-1.315c1.403.763 3.007 1.197 4.712 1.197 5.508 0 9.988-4.479 9.988-9.987 0-5.508-4.48-9.987-9.988-9.987zm4.847 14.239c-.198.558-1.173 1.056-1.612 1.121-.401.059-.803.109-2.26-.479-1.856-.75-3.053-2.645-3.147-2.771-.095-.126-.772-.962-.772-1.836 0-.875.458-1.303.621-1.482.162-.179.356-.224.474-.224h.339c.109 0 .254-.041.396.302.147.356.502 1.221.545 1.31.042.089.071.192.012.31-.059.118-.089.191-.176.295-.089.103-.186.23-.265.308-.103.103-.209.215-.09.422.118.207.525.867 1.128 1.403.777.689 1.432.905 1.639.992.207.086.331.074.455-.068.125-.141.534-.622.676-.835.142-.213.284-.179.479-.107s1.242.585 1.454.693c.213.108.356.161.409.253.054.093.054.538-.145 1.096z"/>
                      </svg>
                      List Vehicle via WhatsApp
                    </button>

                    <p className="text-center text-emerald-600/70 text-xs uppercase tracking-widest leading-relaxed">
                      Your details will be sent to our team via WhatsApp.<br />We'll verify and add it to Rent & Ride.
                    </p>

                    {/* Compliance Notice */}
                    <div className="mt-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl">
                      <div className="flex items-start gap-3">
                        <span className="text-amber-500 text-xl flex-shrink-0 mt-0.5">⚠️</span>
                        <div>
                          <h5 className="text-amber-800 font-bold text-sm mb-1.5">Compliance Notice</h5>
                          <p className="text-amber-700 text-xs leading-relaxed">
                            Only commercially registered rental vehicles and authorized rental operators are permitted to list vehicles on this platform. Personal vehicles with private (white) number plates are not allowed for commercial rental use, in accordance with applicable Indian transport regulations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Default State - How it works */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="p-8 rounded-[2.5rem] bg-white border-2 border-emerald-50 text-center group hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300">
              <div className="text-5xl mb-6">🔍</div>
              <h4 className="text-slate-900 font-black text-xl mb-3">Search Campus</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Type your university name to find bikes and cars available near you.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white border-2 border-emerald-50 text-center group hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300">
              <div className="text-5xl mb-6">🛵</div>
              <h4 className="text-slate-900 font-black text-xl mb-3">Rent a Ride</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Connect with peers instantly via WhatsApp and rent vehicles for hours or days.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white border-2 border-emerald-50 text-center group hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300">
              <div className="text-5xl mb-6">💰</div>
              <h4 className="text-slate-900 font-black text-xl mb-3">Earn by Renting</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Got a spare bike? List it when you're not using it. It automatically goes offline when time is up.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
