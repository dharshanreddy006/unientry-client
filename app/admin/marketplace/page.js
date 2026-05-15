'use client';

import { useState, useEffect } from 'react';
import { API_URL, getImageUrl } from '@/lib/apiConfig';
import Link from 'next/link';

const CATEGORIES = ['Books', 'Electronics', 'Notes & Study Material', 'Clothing', 'Furniture', 'Sports', 'Other'];

const INITIAL_FORM = {
  title: '',
  description: '',
  price: '',
  category: 'Books',
  universityId: '',
  universityName: '',
  sellerName: '',
  type: 'sell',
  status: 'active',
  imageUrl: '',
};

export default function AdminMarketplacePage() {
  const [listings, setListings] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const token = typeof window !== 'undefined' ? localStorage.getItem('unientry_token') : null;
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchListings();
    fetchUniversities();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/marketplace/admin/all`, { headers });
      const data = await res.json();
      setListings(data.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchUniversities = async () => {
    try {
      const res = await fetch(`${API_URL}/universities?limit=200`);
      const data = await res.json();
      setUniversities(data.data || []);
    } catch (e) {}
  };

  const handleEdit = (listing) => {
    setForm({ ...INITIAL_FORM, ...listing });
    setEditId(listing.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this listing from the marketplace?')) return;
    try {
      await fetch(`${API_URL}/marketplace/${id}`, { method: 'DELETE', headers });
      fetchListings();
    } catch (e) { alert('Failed to delete'); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm(f => ({ ...f, imageUrl: data.data.url }));
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleUniChange = (uniId) => {
    const uni = universities.find(u => String(u.id || u._id) === String(uniId));
    setForm(f => ({ ...f, universityId: uniId, universityName: uni ? uni.universityName : '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editId ? `${API_URL}/marketplace/${editId}` : `${API_URL}/marketplace`;
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setEditId(null);
        setForm(INITIAL_FORM);
        fetchListings();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (e) {
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const filteredListings = filterStatus === 'all' ? listings : listings.filter(l => l.status === filterStatus);

  const statusColor = (s) => s === 'active' ? 'bg-green-100 text-green-700' : s === 'sold' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link href="/admin" className="hover:text-accent-600">Admin</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">Marketplace</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Student Marketplace</h1>
          <p className="text-sm text-gray-500 mt-1">Manage buy & sell listings for all universities.</p>
        </div>
        <button
          onClick={() => { setForm(INITIAL_FORM); setEditId(null); setShowForm(!showForm); }}
          className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-2xl font-semibold transition-colors shadow-lg shadow-accent-500/30"
        >
          {showForm ? '✕ Cancel' : '+ Add Listing'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">{editId ? 'Edit Listing' : 'Add New Listing'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* University */}
            <div>
              <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">University *</label>
              <select
                required
                value={form.universityId}
                onChange={e => handleUniChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent-500 outline-none text-sm"
              >
                <option value="">Select a University</option>
                {universities.map(u => (
                  <option key={u.id || u._id} value={u.id || u._id}>{u.universityName}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">Listing Type</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setForm(f => ({ ...f, type: 'sell' }))}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${form.type === 'sell' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  For Sale
                </button>
                <button type="button" onClick={() => setForm(f => ({ ...f, type: 'buy' }))}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${form.type === 'buy' ? 'bg-accent-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  Wanted to Buy
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">Title *</label>
              <input required type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent-500 outline-none text-sm" placeholder="e.g., Engineering Maths Textbook" />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent-500 outline-none text-sm">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">Price (₹)</label>
              <input type="text" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent-500 outline-none text-sm" placeholder="e.g., 299 (leave blank = Negotiable)" />
            </div>

            {/* Seller Name */}
            <div>
              <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">Seller Name</label>
              <input type="text" value={form.sellerName} onChange={e => setForm(f => ({ ...f, sellerName: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent-500 outline-none text-sm" placeholder="Student's name (optional)" />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">Description *</label>
              <textarea required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent-500 outline-none text-sm resize-none"
                placeholder="Product condition, details, etc." />
            </div>

            {/* Product Image */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">Product Photo</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-colors">
                  {uploading ? 'Uploading...' : '📷 Upload Photo'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
                {form.imageUrl && (
                  <img src={getImageUrl(form.imageUrl)} alt="preview" className="w-16 h-16 rounded-xl object-cover border-2 border-green-500" />
                )}
              </div>
            </div>

            {/* Status (edit only) */}
            {editId && (
              <div>
                <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent-500 outline-none text-sm">
                  <option value="active">Active</option>
                  <option value="sold">Sold</option>
                  <option value="removed">Removed</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button type="submit" disabled={saving}
              className="px-8 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-2xl font-bold transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : editId ? 'Update Listing' : 'Add Listing'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(INITIAL_FORM); }}
              className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {['all', 'active', 'sold', 'removed'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all ${filterStatus === s ? 'bg-accent-500 text-white shadow' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}>
            {s === 'all' ? `All (${listings.length})` : `${s} (${listings.filter(l => l.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Listings Table */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-accent-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Loading listings...</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <p className="text-5xl mb-4">🛍️</p>
          <p className="text-gray-400 text-lg font-medium">No listings found</p>
          <p className="text-gray-300 text-sm mt-2">Click "+ Add Listing" to create the first marketplace entry.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredListings.map(listing => (
            <div key={listing.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {listing.imageUrl ? (
                <div className="h-40 overflow-hidden">
                  <img src={getImageUrl(listing.imageUrl)} alt={listing.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-5xl">
                  {listing.category === 'Books' ? '📚' : listing.category === 'Electronics' ? '💻' : '📦'}
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-gray-800 leading-tight">{listing.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize shrink-0 ${statusColor(listing.status)}`}>
                    {listing.status}
                  </span>
                </div>
                <p className="text-xs text-accent-600 font-semibold mb-1">{listing.universityName}</p>
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{listing.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 font-bold text-sm">{listing.price ? `₹${listing.price}` : 'Negotiable'}</p>
                    <p className="text-gray-400 text-xs">{listing.category} • {listing.type === 'sell' ? 'For Sale' : 'Wanted'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(listing)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(listing.id)}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
