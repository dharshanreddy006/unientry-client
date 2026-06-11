'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const API = '/api';
  const token = typeof window !== 'undefined' ? localStorage.getItem('unientry_token') : '';

  const fetchDestinations = async () => {
    try {
      const res = await fetch(`${API}/destinations/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setDestinations(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDestinations(); }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setCurrent({ ...current, imageUrl: data.data.url });
      } else {
        alert('Upload failed: ' + data.message);
        if (data.message && (data.message.includes('Token') || data.message.includes('authorized'))) {
          localStorage.removeItem('unientry_token');
          localStorage.removeItem('unientry_admin');
          window.location.href = '/admin/login';
        }
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = current.id ? 'PUT' : 'POST';
      const url = current.id ? `${API}/destinations/${current.id}` : `${API}/destinations`;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(current)
      });
      const data = await res.json();
      if (data.success) {
        fetchDestinations();
        setShowModal(false);
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this destination?')) return;
    try {
      await fetch(`${API}/destinations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDestinations();
    } catch (err) { console.error(err); }
  };

  return (
    <AdminShell title="Destinations">
      <div className="flex justify-between items-center mb-8">
        <p className="text-gray-500 text-sm">{destinations.length} destinations total</p>
        <button
          onClick={() => { setCurrent({ name: '', flag: '', imageUrl: '', description: '', order: 0, active: true }); setShowModal(true); }}
          className="px-5 py-2.5 bg-accent-500 text-white rounded-xl font-semibold text-sm hover:bg-accent-600 transition-all shadow-lg shadow-accent-500/20 flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add Destination
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest) => (
          <div key={dest.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 group relative">
            <div className="h-40 rounded-xl overflow-hidden mb-4">
              <img src={dest.imageUrl || 'https://via.placeholder.com/600x400'} alt={dest.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{dest.flag}</span>
              <h3 className="font-heading font-bold text-lg text-primary-900">{dest.name}</h3>
              {!dest.active && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>}
            </div>
            <p className="text-gray-500 text-sm line-clamp-2 mb-4">{dest.description}</p>
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-50">
              <button
                onClick={() => { setCurrent(dest); setShowModal(true); }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(dest.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl animate-fade-in-up">
            <h2 className="font-heading font-bold text-2xl text-primary-900 mb-6">{current.id ? 'Edit' : 'Add'} Destination</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country Name</label>
                <input required type="text" value={current.name} onChange={(e) => setCurrent({ ...current, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Flag Emoji</label>
                  <input type="text" value={current.flag} onChange={(e) => setCurrent({ ...current, flag: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" placeholder="🇮🇳" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input type="number" value={current.order} onChange={(e) => setCurrent({ ...current, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={current.description} onChange={(e) => setCurrent({ ...current, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                <div className="flex items-center gap-4">
                  {current.imageUrl && <img src={current.imageUrl} className="w-20 h-20 rounded-xl object-cover" />}
                  <input type="file" onChange={handleImageUpload} disabled={uploading} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-50 file:text-accent-700 hover:file:bg-accent-100" />
                </div>
              </div>
              <div className="flex items-center gap-2 py-2">
                <input type="checkbox" id="active" checked={current.active} onChange={(e) => setCurrent({ ...current, active: e.target.checked })} />
                <label htmlFor="active" className="text-sm text-gray-700">Active (Visible on Website)</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={saving || uploading} className="flex-1 py-3.5 bg-accent-500 text-white rounded-xl font-semibold text-sm hover:bg-accent-600 transition-all disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Destination'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
