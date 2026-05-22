'use client';

import { useState } from 'react';
import { API_URL, getImageUrl } from '@/lib/apiConfig';
import { useSettings } from '@/components/providers/SettingsProvider';
import Link from 'next/link';

export default function UniversityResources() {
  const [universities, setUniversities] = useState([]);
  const settings = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUni, setSelectedUni] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingUnis, setLoadingUnis] = useState(false);
  const [email, setEmail] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(true);

  // Fetch universities only when user starts searching (not on mount)
  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.trim().length > 1 && universities.length === 0) {
      setLoadingUnis(true);
      try {
        const res = await fetch(`${API_URL}/universities`, { cache: 'no-store', signal: AbortSignal.timeout(2000) });
        const data = await res.json();
        setUniversities(data.data || data);
      } catch {}
      setLoadingUnis(false);
    }
  };

  const filteredUnis = searchQuery.trim() === '' 
    ? [] 
    : (Array.isArray(universities) ? universities : []).filter(uni => 
        uni?.universityName?.toLowerCase().trim().includes(searchQuery.toLowerCase().trim())
      ).slice(0, 5);

  const handleSelect = (uni) => {
    setSelectedUni(uni);
    setSearchQuery('');
    setExpandedCategory(null);
    setIsAuthorized(false);
    setShowEmailForm(true);
  };

  const checkAccess = async (e) => {
    if (e) e.preventDefault();
    if (!email) return;
    
    setCheckingAccess(true);
    try {
      // 1. Check if email already has access
      const res = await fetch(`${API_URL}/resources/check-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, universityId: selectedUni.id || selectedUni._id })
      });
      const data = await res.json();
      
      if (data.hasAccess) {
        setIsAuthorized(true);
        setShowEmailForm(false);
      } else {
        // 2. If no access, create a pending request so admin sees it
        await fetch(`${API_URL}/resources/request-access`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, universityId: selectedUni.id || selectedUni._id })
        });
        setShowEmailForm(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingAccess(false);
    }
  };

  const renderGatedContent = () => {
    if (showEmailForm) {
      return (
        <div className="max-w-md mx-auto text-center py-12">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 className="text-slate-900 font-bold text-2xl mb-4">Verification Required</h4>
          <p className="text-slate-500 text-sm mb-8">Enter your email address to check your access status for {selectedUni.universityName} resources.</p>
          <form onSubmit={checkAccess} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
            />
            <button
              type="submit"
              disabled={checkingAccess}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
            >
              {checkingAccess ? 'Checking...' : 'Continue'}
            </button>
          </form>
        </div>
      );
    }

    if (!isAuthorized) {
      // Prioritize University WhatsApp, then Global Settings WhatsApp, then Fallback
      const waNumber = selectedUni.whatsappNumber || settings?.whatsappNumber || '918121665671';
      const isFree = selectedUni.isFreeResources;
      
      return (
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-8 animate-pulse shadow-sm">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0h-2m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-slate-900 font-bold text-3xl mb-4">
            {isFree ? 'Free Access Request' : 'Paid Resources Only'}
          </h4>
          <p className="text-slate-500 text-lg mb-2 leading-relaxed">
            {isFree 
              ? `Access to academic materials for ${selectedUni.universityName} is free, but requires admin approval.`
              : `Access to premium academic materials for ${selectedUni.universityName} requires a one-time payment.`}
          </p>
          <p className="text-blue-600 font-black text-5xl mb-10">
            {isFree ? 'FREE' : `₹${selectedUni.resourcePrice || 25}`}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/${waNumber}?text=Hi%20UniEntry!%20I%20want%20to%20get%20${isFree ? 'FREE' : 'PAID'}%20access%20to%20${selectedUni.universityName}%20resources.%20My%20email%20is%20${email}.%20Please%20grant%20me%20access.`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn flex items-center justify-center gap-3 px-10 py-5 rounded-[2rem] font-bold text-lg shadow-2xl hover:scale-105 transition-all w-full sm:w-auto"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.508 0-9.987 4.479-9.987 9.987 0 1.763.463 3.421 1.264 4.847l-1.341 4.904 5.018-1.315c1.403.763 3.007 1.197 4.712 1.197 5.508 0 9.988-4.479 9.988-9.987 0-5.508-4.48-9.987-9.988-9.987zm4.847 14.239c-.198.558-1.173 1.056-1.612 1.121-.401.059-.803.109-2.26-.479-1.856-.75-3.053-2.645-3.147-2.771-.095-.126-.772-.962-.772-1.836 0-.875.458-1.303.621-1.482.162-.179.356-.224.474-.224h.339c.109 0 .254-.041.396.302.147.356.502 1.221.545 1.31.042.089.071.192.012.31-.059.118-.089.191-.176.295-.089.103-.186.23-.265.308-.103.103-.209.215-.09.422.118.207.525.867 1.128 1.403.777.689 1.432.905 1.639.992.207.086.331.074.455-.068.125-.141.534-.622.676-.835.142-.213.284-.179.479-.107s1.242.585 1.454.693c.213.108.356.161.409.253.054.093.054.538-.145 1.096z"/>
              </svg>
              {isFree ? 'Request Free Access' : 'Pay via WhatsApp'}
            </a>
            <button
              onClick={() => setShowEmailForm(true)}
              className="px-8 py-5 rounded-[2rem] bg-white border border-gray-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all text-sm font-bold shadow-sm"
            >
              Use different email
            </button>
          </div>
          <p className="mt-8 text-slate-300 text-[10px] uppercase tracking-widest leading-relaxed font-bold">
            {isFree 
              ? 'Once the admin approves your email, you can refresh this page to view all resources.'
              : 'Once payment is confirmed, access will be granted to your email. You can then refresh this page to view all resources.'}
          </p>
        </div>
      );
    }

    const categories = Object.entries(
      (selectedUni.uniCheats || []).reduce((acc, cheat) => {
        const cat = cheat.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(cheat);
        return acc;
      }, {})
    );

    if (categories.length === 0) {
      return (
        <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-gray-200">
          <p className="text-slate-400 font-medium text-lg tracking-wider">Coming Soon</p>
          <p className="text-slate-300 text-[10px] mt-2 uppercase tracking-widest font-bold">We are currently gathering resources for this university</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
        {categories.map(([category, items]) => {
          const isExpanded = expandedCategory === category;
          return (
            <div 
              key={category} 
              className={`group/cat rounded-[2rem] transition-all duration-500 border ${
                isExpanded 
                  ? 'bg-blue-50/50 border-blue-200 shadow-xl' 
                  : 'bg-white border-gray-100 hover:bg-slate-50 hover:border-gray-200 shadow-sm'
              }`}
            >
              <button 
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                className="w-full px-8 py-7 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isExpanded ? 'bg-blue-600 scale-150' : 'bg-gray-200'}`} />
                  <h4 className={`font-heading font-bold uppercase tracking-widest text-sm transition-colors duration-300 ${isExpanded ? 'text-blue-600' : 'text-slate-500 group-hover/cat:text-slate-800'}`}>
                    {category}
                  </h4>
                </div>
                <div className={`flex items-center gap-3 transition-all duration-500 ${isExpanded ? 'opacity-100' : 'opacity-40 group-hover/cat:opacity-70'}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{items.length} Files</span>
                  <div className={`w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center transition-all duration-500 ${isExpanded ? 'rotate-180 bg-blue-600 text-white' : 'text-slate-400'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
                <div className="px-8 space-y-3">
                  {items.map((item, idx) => (
                    <a
                      key={idx}
                      href={getImageUrl(item.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-5 rounded-2xl bg-white border border-gray-100 hover:border-blue-300 hover:bg-blue-50/30 transition-all group/item shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover/item:bg-red-500 group-hover/item:text-white transition-all">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <p className="text-slate-800 font-bold group-hover/item:text-blue-600 transition-colors">
                            {item.note || 'University Document'}
                          </p>
                          <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">PDF File • Click to open</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-0 group-hover/item:text-blue-600 group-hover/item:bg-blue-100 group-hover/item:translate-x-1 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="section-padding relative overflow-hidden bg-sky-50/50" id="university-resources">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] -mr-64 -mt-64" style={{background: 'rgba(59,130,246,0.1)'}} />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] -ml-64 -mb-64" style={{background: 'rgba(186,230,253,0.15)'}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-blue-600 font-black uppercase tracking-[0.2em] text-sm mb-4 animate-fade-in">University Resources</h2>
          <h3 className="text-slate-900 font-heading font-black text-3xl md:text-5xl mb-6 animate-fade-in-up">
            Everything You Need <br className="hidden md:block" /> To Excel In Exams
          </h3>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-sky-400 mx-auto rounded-full animate-fade-in delay-200" />
        </div>

        {/* Search Bar Area */}
        <div className="max-w-3xl mx-auto mb-16 relative">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search your university (e.g. UPES, Graphic Era...)"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-8 py-6 rounded-[2rem] bg-white border border-gray-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm text-lg"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <div className="w-10 h-10 rounded-2xl bg-accent-500 flex items-center justify-center text-white shadow-lg shadow-accent-500/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Search Results Dropdown */}
          {searchQuery.trim().length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-4 bg-white border border-blue-100 rounded-[2rem] overflow-hidden shadow-2xl z-50 animate-slide-down">
              {loading ? (
                <div className="px-8 py-10 text-center">
                  <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">Fetching universities...</p>
                </div>
              ) : filteredUnis.length > 0 ? (
                filteredUnis.map(uni => (
                  <button
                    key={uni.id || uni._id}
                    onClick={() => handleSelect(uni)}
                    className="w-full px-8 py-5 flex items-center gap-4 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0 text-left group"
                  >
                    <img 
                      src={getImageUrl(uni?.coverImage?.url) || 'https://images.unsplash.com/photo-1562774053-701939374585?w=100'} 
                      className="w-12 h-12 rounded-xl object-cover group-hover:scale-110 transition-transform" 
                      alt="" 
                    />
                    <div>
                      <p className="text-slate-900 font-bold group-hover:text-blue-600 transition-colors">{uni.universityName}</p>
                      <p className="text-slate-400 text-xs">{uni.city}, {uni.country}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-8 py-10 text-center">
                   <p className="text-slate-400 text-sm">No university found matching "{searchQuery}"</p>
                   <p className="text-blue-600/60 text-[10px] mt-1 uppercase tracking-widest font-bold">Try a different name or city</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resources Display */}
        {selectedUni ? (
          <div className="animate-fade-in">
            <div className="bg-white/80 backdrop-blur-md border border-amber-100/50 rounded-[3rem] p-6 md:p-12 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-6">
                  <img 
                    src={getImageUrl(selectedUni?.coverImage?.url) || 'https://images.unsplash.com/photo-1562774053-701939374585?w=200'} 
                    className="w-20 h-20 md:w-24 md:h-24 rounded-3xl object-cover shadow-2xl" 
                    alt="" 
                  />
                  <div>
                    <h3 className="font-heading font-bold text-2xl md:text-4xl text-slate-900 mb-2">{selectedUni.universityName}</h3>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                        {selectedUni.uniCheats?.length || 0} Resources Available
                      </span>
                      <Link href={`/universities/${selectedUni.id || selectedUni._id}`} className="text-slate-400 hover:text-blue-600 text-xs font-medium flex items-center gap-1 transition-colors">
                        View University Profile ↗
                      </Link>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedUni(null);
                    setExpandedCategory(null);
                  }}
                  className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl text-sm font-bold transition-all border border-gray-200 shadow-sm"
                >
                  Change University
                </button>
              </div>

              {renderGatedContent()}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Access Cards */}
            <div className="p-8 rounded-[2.5rem] bg-white border-2 border-blue-100 text-center group hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-blue-500/10 hover:border-blue-400">
              <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="text-slate-900 font-black text-xl mb-3">Handwritten Notes</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Access high-quality notes prepared by toppers and faculty members.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white border-2 border-blue-100 text-center group hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-blue-500/10 hover:border-blue-400">
              <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-slate-900 font-black text-xl mb-3">Question Papers</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Practice with previous years' papers to excel in your semester exams.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white border-2 border-blue-100 text-center group hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-blue-500/10 hover:border-blue-400">
              <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="text-slate-900 font-black text-xl mb-3">Lab Records</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Download experiments and lab manuals for all technical branches.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
