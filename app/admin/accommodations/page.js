'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';

const emptyForm = { 
  propertyName: '', 
  roomType: '', 
  price: '', 
  distance: '', 
  description: '', 
  amenities: '', 
  location: '', 
  detailedLocation: '',
  propertyType: 'Flat', 
  priceMonthly: '',
  priceYearly: '',
  coLiving: false,
  coupleFriendly: false,
  genderPreference: 'Unisex',
  depositAmount: '',
  ownerPhone: '',
  universityId: '', 
  imageUrl: [], 
  active: true 
};

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

export default function AdminAccommodations() {
  const [accommodations, setAccommodations] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const API = '/api';
  const token = typeof window !== 'undefined' ? localStorage.getItem('unientry_token') : '';
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Use chunked upload if file is larger than 3MB
        if (file.size > 3 * 1024 * 1024) {
          const chunkSize = 2 * 1024 * 1024; // 2MB chunks
          const totalChunks = Math.ceil(file.size / chunkSize);
          const sanitizedFilename = file.name.replace(/\s+/g, '_');
          const filename = `${Date.now()}-${sanitizedFilename}`;
          
          let finalUrl = '';
          for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const start = chunkIndex * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);
            
            const formData = new FormData();
            formData.append('chunk', chunk);
            formData.append('filename', filename);
            formData.append('chunkIndex', chunkIndex.toString());
            formData.append('totalChunks', totalChunks.toString());
            
            // Chunk upload always goes relative (/api/upload/chunk) which is proxied
            // and safely bypasses the 4.5MB Vercel size limit since chunk size is 2MB
            const res = await fetch('/api/upload/chunk', {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            });
            const data = await res.json();
            if (!data.success) {
              throw new Error(data.message || `Failed to upload chunk ${chunkIndex + 1}`);
            }
            if (data.data?.url) {
              finalUrl = data.data.url;
            }
          }
          if (finalUrl) {
            uploadedUrls.push(finalUrl);
          } else {
            throw new Error('Failed to assemble file chunks on server');
          }
        } else {
          // Standard single upload for small files (using relative proxy path)
          const formData = new FormData();
          formData.append('image', file);
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
          const data = await res.json();
          if (data.success) {
            uploadedUrls.push(data.data.url);
          } else {
            alert('Upload failed: ' + data.message);
            if (data.message && (data.message.includes('Token') || data.message.includes('authorized'))) {
              localStorage.removeItem('unientry_token');
              localStorage.removeItem('unientry_admin');
              window.location.href = '/admin/login';
              return;
            }
          }
        }
      }
      const currentImages = Array.isArray(form.imageUrl) ? form.imageUrl : (form.imageUrl ? [form.imageUrl] : []);
      setForm({ ...form, imageUrl: [...currentImages, ...uploadedUrls] });
    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [accRes, uniRes] = await Promise.all([
        fetch(`${API}/accommodations/all`, { headers, cache: 'no-store' }),
        fetch(`${API}/universities`, { cache: 'no-store' })
      ]);
      const accData = await accRes.json();
      const uniData = await uniRes.json();
      
      if (accData.success) setAccommodations(accData.data);
      if (uniData.success) setUniversities(uniData.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEdit = (acc) => {
    setEditId(acc._id);
    const images = Array.isArray(acc.imageUrl) ? acc.imageUrl : (acc.imageUrl ? [acc.imageUrl] : []);
    setForm({ 
      ...acc, 
      imageUrl: images, 
      amenities: acc.amenities?.join(', ') || '',
      detailedLocation: acc.detailedLocation || '',
      propertyType: acc.propertyType || 'Flat',
      priceMonthly: acc.priceMonthly || '',
      priceYearly: acc.priceYearly || '',
      coLiving: acc.coLiving ?? false,
      coupleFriendly: acc.coupleFriendly ?? false,
      genderPreference: acc.genderPreference || 'Unisex',
      depositAmount: acc.depositAmount || '',
      ownerPhone: acc.ownerPhone || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this accommodation?')) return;
    try {
      await fetch(`${API}/accommodations/${id}`, { method: 'DELETE', headers });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { 
        ...form, 
        amenities: typeof form.amenities === 'string' ? form.amenities.split(',').map(s => s.trim()).filter(Boolean) : form.amenities,
        universityId: form.universityId ? parseInt(form.universityId) : null,
        priceMonthly: form.priceMonthly ? parseInt(form.priceMonthly) : null,
        priceYearly: form.priceYearly ? parseInt(form.priceYearly) : null,
        coLiving: !!form.coLiving,
        coupleFriendly: !!form.coupleFriendly
      };
      const url = editId ? `${API}/accommodations/${editId}` : `${API}/accommodations`;
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) {
        setShowForm(false); setEditId(null); setForm(emptyForm); fetchData();
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <AdminShell title="Accommodation Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-500">{accommodations.length} properties listed</p>
          <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
            className="px-5 py-2.5 bg-accent-500 text-white rounded-xl text-sm font-semibold hover:bg-accent-600 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Property
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto">
            <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl my-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-semibold text-xl text-primary-900">{editId ? 'Edit' : 'Add'} Property</h2>
                <button onClick={() => { setShowForm(false); setEditId(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Name *</label>
                    <input type="text" required value={form.propertyName} onChange={(e) => setForm({ ...form, propertyName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Type *</label>
                    <input type="text" required value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" placeholder="e.g. Single, Shared, Studio" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Text (fallback) *</label>
                    <input type="text" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" placeholder="e.g. £800/month" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Distance *</label>
                    <input type="text" required value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" placeholder="e.g. 5 mins walk" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Linked University *</label>
                    <select required value={form.universityId} onChange={(e) => setForm({ ...form, universityId: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm">
                      <option value="">Select University</option>
                      {universities.map(uni => (
                        <option key={uni.id} value={uni.id}>{uni.universityName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">General Location (City, Country) *</label>
                    <input type="text" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" placeholder="City, Country" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
                    <select required value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm">
                      <option value="Flat">Flat</option>
                      <option value="Hostel">Hostel</option>
                      <option value="PG">PG</option>
                      <option value="Studio Apartment">Studio Apartment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender Preference *</label>
                    <select required value={form.genderPreference} onChange={(e) => setForm({ ...form, genderPreference: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm">
                      <option value="Unisex">Unisex</option>
                      <option value="Boys">Boys</option>
                      <option value="Girls">Girls</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Monthly (Numerical) *</label>
                    <input type="number" required value={form.priceMonthly} onChange={(e) => setForm({ ...form, priceMonthly: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" placeholder="e.g. 15000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Yearly (Numerical)</label>
                    <input type="number" value={form.priceYearly} onChange={(e) => setForm({ ...form, priceYearly: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" placeholder="e.g. 180000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount</label>
                    <input type="text" value={form.depositAmount} onChange={(e) => setForm({ ...form, depositAmount: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" placeholder="e.g. 2 months rent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Owner WhatsApp Number *</label>
                    <input type="text" required value={form.ownerPhone} onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" placeholder="e.g. 919876543210" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Detailed/Accurate Address Location</label>
                  <input type="text" value={form.detailedLocation} onChange={(e) => setForm({ ...form, detailedLocation: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" placeholder="e.g. Plot 4B, Sector 62, Noida" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma separated)</label>
                  <input type="text" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" placeholder="Wifi, Laundry, Gym" />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Media (Images & Videos)</label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {(Array.isArray(form.imageUrl) ? form.imageUrl : (form.imageUrl ? [form.imageUrl] : [])).map((url, idx) => {
                      const isVid = isVideoUrl(url);
                      return (
                        <div key={idx} className="relative w-20 h-20 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 group">
                          {isVid ? (
                            <video src={url} className="w-full h-full object-cover" muted />
                          ) : (
                            <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const currentImages = Array.isArray(form.imageUrl) ? form.imageUrl : (form.imageUrl ? [form.imageUrl] : []);
                              const newImages = currentImages.filter((_, i) => i !== idx);
                              setForm({ ...form, imageUrl: newImages });
                            }}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold rounded-xl"
                          >
                            Delete ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="block w-full text-xs text-gray-500
                          file:mr-4 file:py-2.5 file:px-4
                          file:rounded-xl file:border-0
                          file:text-xs file:font-semibold
                          file:bg-accent-50 file:text-accent-700
                          hover:file:bg-accent-100 transition-all"
                      />
                      {uploading && <p className="text-[10px] text-accent-600 mt-2 animate-pulse">Uploading...</p>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="coLiving" checked={form.coLiving} onChange={(e) => setForm({ ...form, coLiving: e.target.checked })} className="w-4 h-4 rounded" />
                    <label htmlFor="coLiving" className="text-sm text-gray-700">Co-Living</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="coupleFriendly" checked={form.coupleFriendly} onChange={(e) => setForm({ ...form, coupleFriendly: e.target.checked })} className="w-4 h-4 rounded" />
                    <label htmlFor="coupleFriendly" className="text-sm text-gray-700">Couple Friendly</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="active" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 rounded" />
                    <label htmlFor="active" className="text-sm text-gray-700">Active</label>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="flex-1 py-3 bg-accent-500 text-white rounded-xl font-semibold text-sm hover:bg-accent-600 disabled:opacity-50">
                    {saving ? 'Saving...' : (editId ? 'Update' : 'Add Property')}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-accent-200 border-t-accent-500 rounded-full animate-spin" /></div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-5 text-gray-400 font-medium">Property</th>
                  <th className="text-left py-4 px-5 text-gray-400 font-medium">Room Type</th>
                  <th className="text-left py-4 px-5 text-gray-400 font-medium">Price</th>
                  <th className="text-left py-4 px-5 text-gray-400 font-medium">Distance</th>
                  <th className="text-left py-4 px-5 text-gray-400 font-medium">University</th>
                  <th className="text-right py-4 px-5 text-gray-400 font-medium">Actions</th>
                </tr></thead>
                <tbody>
                  {accommodations.map((acc) => (
                    <tr key={acc._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-medium text-primary-900">{acc.propertyName}</div>
                        <div className="text-[10px] text-gray-400">{acc.location}</div>
                      </td>
                      <td className="py-4 px-5 text-gray-500">{acc.roomType}</td>
                      <td className="py-4 px-5 text-gray-500 font-semibold text-accent-600">{acc.price}</td>
                      <td className="py-4 px-5 text-gray-500">{acc.distance}</td>
                      <td className="py-4 px-5 text-gray-500">
                        {universities.find(u => u.id === acc.universityId)?.universityName || 'Not Linked'}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(acc)} className="p-2 hover:bg-accent-50 rounded-lg text-accent-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={() => handleDelete(acc._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
