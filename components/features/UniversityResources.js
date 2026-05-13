'use client';

import { useState, useEffect } from 'react';
import { API_URL, getImageUrl } from '@/lib/apiConfig';
import Link from 'next/link';

export default function UniversityResources() {
  const [universities, setUniversities] = useState([]);
  const [settings, setSettings] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUni, setSelectedUni] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(true);

  useEffect(() => {
    // Fetch Universities
    fetch(`${API_URL}/universities`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setUniversities(data.data || data);
      })
      .catch(err => console.error(err));

    // Fetch Site Settings for global WhatsApp number
    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setSettings(data.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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
          <div className="w-20 h-20 bg-accent-500/10 rounded-3xl flex items-center justify-center text-accent-400 mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 className="text-white font-bold text-2xl mb-4">Verification Required</h4>
          <p className="text-white/40 text-sm mb-8">Enter your email address to check your access status for {selectedUni.universityName} resources.</p>
          <form onSubmit={checkAccess} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-accent-500 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={checkingAccess}
              className="w-full py-4 bg-accent-500 hover:bg-accent-600 text-white rounded-2xl font-bold transition-all disabled:opacity-50"
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
          <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500 mx-auto mb-8 animate-pulse">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0h-2m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-white font-bold text-3xl mb-4">
            {isFree ? 'Free Access Request' : 'Paid Resources Only'}
          </h4>
          <p className="text-white/60 text-lg mb-2">
            {isFree 
              ? `Access to academic materials for ${selectedUni.universityName} is free, but requires admin approval.`
              : `Access to premium academic materials for ${selectedUni.universityName} requires a one-time payment.`}
          </p>
          <p className="text-accent-400 font-black text-4xl mb-10">
            {isFree ? 'FREE' : `Pay ${selectedUni.resourcePrice || 25}Rs`}
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
              className="px-8 py-5 rounded-[2rem] bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all text-sm font-bold"
            >
              Use different email
            </button>
          </div>
          <p className="mt-8 text-white/20 text-xs uppercase tracking-widest leading-relaxed">
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
        <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
          <p className="text-white/40 font-medium text-lg tracking-wider">Coming Soon</p>
          <p className="text-white/20 text-xs mt-2 uppercase tracking-widest">We are currently gathering resources for this university</p>
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
                  ? 'bg-white/[0.08] border-white/20 shadow-2xl' 
                  : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
              }`}
            >
              <button 
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                className="w-full px-8 py-7 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isExpanded ? 'bg-accent-500 scale-150 shadow-[0_0_15px_rgba(var(--accent-500-rgb),0.5)]' : 'bg-white/20'}`} />
                  <h4 className={`font-heading font-bold uppercase tracking-widest text-sm transition-colors duration-300 ${isExpanded ? 'text-white' : 'text-white/60 group-hover/cat:text-white/80'}`}>
                    {category}
                  </h4>
                </div>
                <div className={`flex items-center gap-3 transition-all duration-500 ${isExpanded ? 'opacity-100' : 'opacity-40 group-hover/cat:opacity-70'}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{items.length} Files</span>
                  <div className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center transition-all duration-500 ${isExpanded ? 'rotate-180 bg-accent-500/20 text-accent-400' : 'text-white'}`}>
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
                      className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-accent-500/50 hover:bg-white/10 transition-all group/item"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover/item:bg-red-500 group-hover/item:text-white transition-all shadow-inner">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <p className="text-white font-bold group-hover/item:text-accent-400 transition-colors">
                            {item.note || 'University Document'}
                          </p>
                          <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">PDF File • Click to open</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white/0 group-hover/item:text-accent-500 group-hover/item:bg-accent-500/10 group-hover/item:translate-x-1 transition-all">
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
    <section className="section-padding bg-primary-900 relative overflow-hidden" id="university-resources">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 text-accent-400 text-xs font-bold mb-4 tracking-widest uppercase border border-white/10">
            KNOWLEDGE HUB
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
            University <span className="text-accent-400">Resources</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Access previous year question papers, handwritten notes, and academic materials for your university.
          </p>
        </div>

        {/* Search Bar Area */}
        <div className="max-w-3xl mx-auto mb-16 relative">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search your university (e.g. UPES, Graphic Era...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-8 py-6 rounded-[2rem] bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-accent-500 outline-none transition-all shadow-2xl text-lg backdrop-blur-xl"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white">
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
            <div className="absolute top-full left-0 right-0 mt-4 bg-primary-800 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl z-50 backdrop-blur-2xl animate-slide-down">
              {loading ? (
                <div className="px-8 py-10 text-center">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-accent-500 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-white/40 text-sm">Fetching universities...</p>
                </div>
              ) : filteredUnis.length > 0 ? (
                filteredUnis.map(uni => (
                  <button
                    key={uni.id || uni._id}
                    onClick={() => handleSelect(uni)}
                    className="w-full px-8 py-5 flex items-center gap-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left group"
                  >
                    <img 
                      src={getImageUrl(uni?.coverImage?.url) || 'https://images.unsplash.com/photo-1562774053-701939374585?w=100'} 
                      className="w-12 h-12 rounded-xl object-cover group-hover:scale-110 transition-transform" 
                      alt="" 
                    />
                    <div>
                      <p className="text-white font-bold group-hover:text-accent-400 transition-colors">{uni.universityName}</p>
                      <p className="text-white/40 text-xs">{uni.city}, {uni.country}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-8 py-10 text-center">
                   <p className="text-white/40 text-sm">No university found matching "{searchQuery}"</p>
                   <p className="text-accent-400/60 text-xs mt-1">Try a different name or city</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resources Display */}
        {selectedUni ? (
          <div className="animate-fade-in">
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-6">
                  <img 
                    src={getImageUrl(selectedUni?.coverImage?.url) || 'https://images.unsplash.com/photo-1562774053-701939374585?w=200'} 
                    className="w-20 h-20 md:w-24 md:h-24 rounded-3xl object-cover shadow-2xl" 
                    alt="" 
                  />
                  <div>
                    <h3 className="font-heading font-bold text-2xl md:text-4xl text-white mb-2">{selectedUni.universityName}</h3>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-xs font-bold uppercase tracking-wider">
                        {selectedUni.uniCheats?.length || 0} Resources Available
                      </span>
                      <Link href={`/universities/${selectedUni.id || selectedUni._id}`} className="text-white/40 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors">
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
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-sm font-bold transition-all border border-white/10"
                >
                  Change University
                </button>
              </div>

              {renderGatedContent()}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quick Access Cards */}
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-center group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 rounded-3xl bg-accent-500/20 text-accent-400 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="text-white font-bold text-xl mb-3">Handwritten Notes</h4>
              <p className="text-white/40 text-sm leading-relaxed">Access high-quality notes prepared by toppers and faculty members.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-center group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 rounded-3xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-white font-bold text-xl mb-3">Question Papers</h4>
              <p className="text-white/40 text-sm leading-relaxed">Practice with previous years' papers to excel in your semester exams.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-center group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 rounded-3xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="text-white font-bold text-xl mb-3">Lab Records</h4>
              <p className="text-white/40 text-sm leading-relaxed">Download experiments and lab manuals for all technical branches.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
