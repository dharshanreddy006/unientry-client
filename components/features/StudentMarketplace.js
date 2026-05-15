'use client';

import { useState, useEffect } from 'react';
import { API_URL, getImageUrl } from '@/lib/apiConfig';

const CATEGORIES = ['All', 'Books', 'Electronics', 'Notes & Study Material', 'Clothing', 'Furniture', 'Sports', 'Other'];

export default function StudentMarketplace() {
  const [universities, setUniversities] = useState([]);
  const [settings, setSettings] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUni, setSelectedUni] = useState(null);
  const [activeTab, setActiveTab] = useState('buy');
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [loadingUnis, setLoadingUnis] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sell form
  const [sellForm, setSellForm] = useState({ title: '', description: '', price: '', category: 'Books', sellerName: '' });

  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then(r => r.json())
      .then(d => { if (d.success) setSettings(d.data); })
      .catch(() => {});
  }, []);

  const filteredUnis = searchQuery.trim().length > 1
    ? (universities).filter(u => u?.universityName?.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.trim().length > 1 && universities.length === 0) {
      setLoadingUnis(true);
      try {
        const res = await fetch(`${API_URL}/universities?limit=200`);
        const data = await res.json();
        setUniversities(data.data || []);
      } catch (e) {}
      setLoadingUnis(false);
    }
  };

  const handleSelectUni = async (uni) => {
    setSelectedUni(uni);
    setSearchQuery('');
    setActiveTab('buy');
    setSelectedCategory('All');
    fetchListings(uni.id || uni._id, 'sell');
  };

  const fetchListings = async (uniId, type) => {
    setLoadingListings(true);
    try {
      const res = await fetch(`${API_URL}/marketplace?universityId=${uniId}&type=${type}`);
      const data = await res.json();
      setListings(data.data || []);
    } catch (e) { setListings([]); }
    setLoadingListings(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedCategory('All');
    if (selectedUni) fetchListings(selectedUni.id || selectedUni._id, tab === 'buy' ? 'sell' : 'buy');
  };

  const getWaNumber = () => settings?.whatsappNumber || '918121665671';

  const handleSellWhatsApp = () => {
    const { title, description, price, category, sellerName } = sellForm;
    if (!title || !description) return alert('Please fill in at least the title and description.');
    const uniName = selectedUni.universityName;
    const msg = `Hi UniEntry! I want to list a product for sale at *${uniName}*.\n\n*Product:* ${title}\n*Category:* ${category}\n*Price:* ₹${price || 'Negotiable'}\n*Description:* ${description}\n*Seller Name:* ${sellerName || 'Anonymous'}\n\nPlease add this to the marketplace.`;
    window.open(`https://wa.me/${getWaNumber()}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleBuyWhatsApp = (listing) => {
    const msg = `Hi UniEntry! I am interested in buying *"${listing.title}"* listed at *${selectedUni.universityName}*.\n\n*Price:* ${listing.price}\n\nPlease connect me with the seller.`;
    window.open(`https://wa.me/${getWaNumber()}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const filteredListings = selectedCategory === 'All'
    ? listings
    : listings.filter(l => l.category === selectedCategory);

  return (
    <section className="section-padding relative overflow-hidden" style={{background: 'linear-gradient(160deg, #042F2E 0%, #0D6E6A 50%, #14B8A6 100%)'}} id="marketplace">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[150px] -ml-64 -mt-64 pointer-events-none" style={{background: 'rgba(255,255,255,0.07)'}} />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[150px] -mr-64 -mb-64 pointer-events-none" style={{background: 'rgba(45,212,191,0.1)'}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4 tracking-widest uppercase border" style={{background: 'rgba(255,255,255,0.12)', color: '#CCFBF1', borderColor: 'rgba(255,255,255,0.2)'}}>
            STUDENT MARKETPLACE
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
            Buy & Sell <span style={{color: '#5EEAD4'}}>Within Your Campus</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Books, electronics, notes — trade with students from your university. Select your university below to get started.
          </p>
        </div>

        {/* University Search */}
        <div className="max-w-3xl mx-auto mb-10 relative">
            <div className="relative">
            <input
              type="text"
              placeholder="Search your university to start buying or selling..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="w-full px-8 py-6 rounded-[2rem] border text-white placeholder:text-white/40 outline-none transition-all text-lg backdrop-blur-xl"
              style={{background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.15)'}}
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{background: '#0D9488'}}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Dropdown */}
          {searchQuery.trim().length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-primary-800 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl z-50 backdrop-blur-2xl">
              {loadingUnis ? (
                <div className="px-8 py-8 text-center">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-green-500 rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-white/40 text-sm">Searching universities...</p>
                </div>
              ) : filteredUnis.length > 0 ? (
                filteredUnis.map(uni => (
                  <button
                    key={uni.id || uni._id}
                    onClick={() => handleSelectUni(uni)}
                    className="w-full px-8 py-5 flex items-center gap-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left group"
                  >
                    <img
                      src={getImageUrl(uni?.coverImage?.url) || 'https://images.unsplash.com/photo-1562774053-701939374585?w=100'}
                      className="w-12 h-12 rounded-xl object-cover"
                      alt=""
                    />
                    <div>
                      <p className="text-white font-bold group-hover:text-green-400 transition-colors">{uni.universityName}</p>
                      <p className="text-white/40 text-xs">{uni.city}, {uni.country}</p>
                    </div>
                    <div className="ml-auto text-white/20 group-hover:text-green-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-8 py-10 text-center">
                  <p className="text-white/40 text-sm">No university found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected University View */}
        {selectedUni ? (
          <div className="animate-fade-in">
            {/* University Header */}
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <img
                  src={getImageUrl(selectedUni?.coverImage?.url) || 'https://images.unsplash.com/photo-1562774053-701939374585?w=200'}
                  className="w-20 h-20 rounded-2xl object-cover shadow-xl"
                  alt=""
                />
                <div>
                  <h3 className="font-heading font-bold text-2xl md:text-3xl text-white">{selectedUni.universityName}</h3>
                  <p className="text-white/40 text-sm mt-1">{selectedUni.city}, {selectedUni.country}</p>
                </div>
              </div>
              <button
                onClick={() => { setSelectedUni(null); setListings([]); }}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-sm font-bold transition-all border border-white/10 self-start md:self-auto"
              >
                Change University
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={() => handleTabChange('buy')}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'buy' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Buy Products
              </button>
              <button
                onClick={() => handleTabChange('sell')}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'sell' ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/20' : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Sell a Product
              </button>
            </div>

            {/* BUY TAB */}
            {activeTab === 'buy' && (
              <div>
                {/* Category Filter */}
                <div className="flex gap-2 flex-wrap mb-8">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${selectedCategory === cat ? 'bg-green-500 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/10'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {loadingListings ? (
                  <div className="text-center py-20">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-green-500 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-white/40 text-sm">Loading listings...</p>
                  </div>
                ) : filteredListings.length === 0 ? (
                  <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                    <div className="text-5xl mb-4">🛍️</div>
                    <p className="text-white/40 font-medium text-lg">No products listed yet</p>
                    <p className="text-white/20 text-xs mt-2 uppercase tracking-widest">Be the first to sell something at {selectedUni.universityName}!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map(listing => (
                      <div key={listing.id} className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden group hover:border-green-500/30 hover:-translate-y-1 transition-all duration-300">
                        {listing.imageUrl ? (
                          <div className="h-48 overflow-hidden">
                            <img
                              src={getImageUrl(listing.imageUrl)}
                              alt={listing.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div className="h-48 bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center text-6xl">
                            {listing.category === 'Books' ? '📚' : listing.category === 'Electronics' ? '💻' : listing.category === 'Notes & Study Material' ? '📝' : listing.category === 'Clothing' ? '👕' : listing.category === 'Furniture' ? '🪑' : listing.category === 'Sports' ? '⚽' : '📦'}
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h4 className="text-white font-bold text-lg leading-tight">{listing.title}</h4>
                            <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold whitespace-nowrap shrink-0">
                              {listing.price ? `₹${listing.price}` : 'Negotiable'}
                            </span>
                          </div>
                          <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">{listing.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-white/20 text-xs uppercase tracking-widest font-bold">{listing.category}</span>
                            <button
                              onClick={() => handleBuyWhatsApp(listing)}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold transition-all hover:scale-105"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.012 2c-5.508 0-9.987 4.479-9.987 9.987 0 1.763.463 3.421 1.264 4.847l-1.341 4.904 5.018-1.315c1.403.763 3.007 1.197 4.712 1.197 5.508 0 9.988-4.479 9.988-9.987 0-5.508-4.48-9.987-9.988-9.987zm4.847 14.239c-.198.558-1.173 1.056-1.612 1.121-.401.059-.803.109-2.26-.479-1.856-.75-3.053-2.645-3.147-2.771-.095-.126-.772-.962-.772-1.836 0-.875.458-1.303.621-1.482.162-.179.356-.224.474-.224h.339c.109 0 .254-.041.396.302.147.356.502 1.221.545 1.31.042.089.071.192.012.31-.059.118-.089.191-.176.295-.089.103-.186.23-.265.308-.103.103-.209.215-.09.422.118.207.525.867 1.128 1.403.777.689 1.432.905 1.639.992.207.086.331.074.455-.068.125-.141.534-.622.676-.835.142-.213.284-.179.479-.107s1.242.585 1.454.693c.213.108.356.161.409.253.054.093.054.538-.145 1.096z"/>
                              </svg>
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SELL TAB */}
            {activeTab === 'sell' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-3xl bg-accent-500/10 text-accent-400 flex items-center justify-center mx-auto mb-4 text-3xl">
                      📦
                    </div>
                    <h4 className="text-white font-bold text-2xl mb-2">List Your Product</h4>
                    <p className="text-white/40 text-sm">Fill in the details below and we'll list it via WhatsApp. Our team will add it to the marketplace.</p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Product Title *</label>
                      <input
                        type="text"
                        placeholder="e.g., Engineering Mathematics Textbook"
                        value={sellForm.title}
                        onChange={e => setSellForm({ ...sellForm, title: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-accent-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Category</label>
                      <select
                        value={sellForm.category}
                        onChange={e => setSellForm({ ...sellForm, category: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-accent-500 outline-none transition-all"
                      >
                        {CATEGORIES.filter(c => c !== 'All').map(c => (
                          <option key={c} value={c} className="bg-gray-900">{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Price (₹)</label>
                      <input
                        type="text"
                        placeholder="e.g., 299 (leave blank for Negotiable)"
                        value={sellForm.price}
                        onChange={e => setSellForm({ ...sellForm, price: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-accent-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Description *</label>
                      <textarea
                        rows={4}
                        placeholder="Describe the condition, edition, or any details about the product..."
                        value={sellForm.description}
                        onChange={e => setSellForm({ ...sellForm, description: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-accent-500 outline-none transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Your Name (Optional)</label>
                      <input
                        type="text"
                        placeholder="Your name for the listing"
                        value={sellForm.sellerName}
                        onChange={e => setSellForm({ ...sellForm, sellerName: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-accent-500 outline-none transition-all"
                      />
                    </div>

                    <button
                      onClick={handleSellWhatsApp}
                      className="w-full py-5 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-lg shadow-green-500/30"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.012 2c-5.508 0-9.987 4.479-9.987 9.987 0 1.763.463 3.421 1.264 4.847l-1.341 4.904 5.018-1.315c1.403.763 3.007 1.197 4.712 1.197 5.508 0 9.988-4.479 9.988-9.987 0-5.508-4.48-9.987-9.988-9.987zm4.847 14.239c-.198.558-1.173 1.056-1.612 1.121-.401.059-.803.109-2.26-.479-1.856-.75-3.053-2.645-3.147-2.771-.095-.126-.772-.962-.772-1.836 0-.875.458-1.303.621-1.482.162-.179.356-.224.474-.224h.339c.109 0 .254-.041.396.302.147.356.502 1.221.545 1.31.042.089.071.192.012.31-.059.118-.089.191-.176.295-.089.103-.186.23-.265.308-.103.103-.209.215-.09.422.118.207.525.867 1.128 1.403.777.689 1.432.905 1.639.992.207.086.331.074.455-.068.125-.141.534-.622.676-.835.142-.213.284-.179.479-.107s1.242.585 1.454.693c.213.108.356.161.409.253.054.093.054.538-.145 1.096z"/>
                      </svg>
                      List Product via WhatsApp
                    </button>

                    <p className="text-center text-white/20 text-xs uppercase tracking-widest">
                      Your product details will be sent to our team via WhatsApp.<br />We'll add it to the marketplace shortly.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Default State - How it works */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-center group hover:-translate-y-2 transition-all duration-500">
              <div className="text-5xl mb-6">🔍</div>
              <h4 className="text-white font-bold text-xl mb-3">Search Your University</h4>
              <p className="text-white/40 text-sm leading-relaxed">Type your college or university name in the search bar above to find your campus marketplace.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-center group hover:-translate-y-2 transition-all duration-500">
              <div className="text-5xl mb-6">🛒</div>
              <h4 className="text-white font-bold text-xl mb-3">Browse & Buy</h4>
              <p className="text-white/40 text-sm leading-relaxed">Find books, electronics, notes, and more listed by students from your campus. Contact them via WhatsApp.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-center group hover:-translate-y-2 transition-all duration-500">
              <div className="text-5xl mb-6">💸</div>
              <h4 className="text-white font-bold text-xl mb-3">Sell Your Stuff</h4>
              <p className="text-white/40 text-sm leading-relaxed">Got something to sell? List it instantly via WhatsApp. Our team will add it to the marketplace within minutes.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
