'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';

const emptyForm = {
  universityName: '', country: '', city: '', description: '', duration: '4 Years',
  degreeType: 'Undergraduate', courses: '', featured: false, ranking: '', website: '',
  fees: { tuition: '', hostel: '', livingCost: '' },
  eligibility: { marks: '', ielts: '', toefl: '', documents: '' },
  coverImage: { url: '', publicId: '' },
  uniCheatsUrl: '',
  referAndEarn: '',
};

export default function AdminUniversities() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const API = 'https://unientry-server-production.up.railway.app/api';
  const token = typeof window !== 'undefined' ? localStorage.getItem('unientry_token') : '';
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/universities?limit=100`);
      const data = await res.json();
      if (data.success) setUniversities(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUniversities(); }, []);

  const handleEdit = (uni) => {
    setEditId(uni._id);
    setForm({
      ...uni,
      courses: uni.courses?.join(', ') || '',
      eligibility: {
        ...uni.eligibility,
        documents: uni.eligibility?.documents?.join(', ') || '',
      },
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this university?')) return;
    try {
      await fetch(`${API}/universities/${id}`, { method: 'DELETE', headers });
      fetchUniversities();
    } catch (err) { console.error(err); }
  };

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
        setForm({ ...form, coverImage: { url: data.data.url, publicId: data.data.filename } });
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file); // using the same endpoint
      const res = await fetch(`${API}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm({ ...form, uniCheatsUrl: data.data.url });
      } else {
        alert('Upload failed: ' + data.message);
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
      const body = {
        ...form,
        courses: form.courses.split(',').map(c => c.trim()).filter(Boolean),
        eligibility: {
          ...form.eligibility,
          documents: form.eligibility.documents?.split(',').map(d => d.trim()).filter(Boolean) || [],
        },
      };

      const url = editId ? `${API}/universities/${editId}` : `${API}/universities`;
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
      const data = await res.json();

      if (data.success) {
        setShowForm(false);
        setEditId(null);
        setForm(emptyForm);
        fetchUniversities();
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <AdminShell title="University Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-gray-500">{universities.length} universities total</p>
          <button
            onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
            className="px-5 py-2.5 bg-accent-500 text-white rounded-xl text-sm font-semibold hover:bg-accent-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add University
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto">
            <div className="bg-white rounded-3xl p-8 w-full max-w-3xl shadow-2xl my-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-semibold text-xl text-primary-900">
                  {editId ? 'Edit University' : 'Add University'}
                </h2>
                <button onClick={() => { setShowForm(false); setEditId(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">University Name *</label>
                    <input type="text" required value={form.universityName} onChange={(e) => setForm({ ...form, universityName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                    <input type="text" required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input type="text" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree Type</label>
                    <select value={form.degreeType} onChange={(e) => setForm({ ...form, degreeType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm">
                      <option>Undergraduate</option><option>Postgraduate</option><option>Doctorate</option><option>Diploma</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ranking</label>
                    <input type="text" value={form.ranking} onChange={(e) => setForm({ ...form, ranking: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" placeholder="e.g., #1 in Germany" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm resize-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                  {form.coverImage?.url ? (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 mb-2">
                      <img src={form.coverImage.url} alt="Cover" className="w-full h-40 object-cover" />
                      <button type="button" onClick={() => setForm({ ...form, coverImage: { url: '', publicId: '' } })}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-accent-400 hover:bg-accent-50/30 transition-all">
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-3 border-accent-200 border-t-accent-500 rounded-full animate-spin" />
                          <span className="text-sm text-gray-500">Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-500">Click to upload image</span>
                          <span className="text-xs text-gray-400">JPG, PNG, GIF, WebP (max 5MB)</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Uni Cheats (PDF)</label>
                  {form.uniCheatsUrl ? (
                    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl mb-2">
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.03 16.924c-1.396 0-2.342-.907-2.342-2.32 0-1.455.986-2.378 2.372-2.378 1.405 0 2.316.907 2.316 2.335 0 1.464-.954 2.363-2.346 2.363zm2.505-8.226h-4.996v-5h4.996v5z"/></svg>
                        <a href={form.uniCheatsUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent-600 hover:underline">View Uploaded PDF</a>
                      </div>
                      <button type="button" onClick={() => setForm({ ...form, uniCheatsUrl: '' })}
                        className="text-red-500 hover:text-red-600 font-semibold text-sm transition-colors">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-accent-400 hover:bg-accent-50/30 transition-all">
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border-3 border-accent-200 border-t-accent-500 rounded-full animate-spin" />
                          <span className="text-sm text-gray-500">Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span className="text-sm text-gray-500">Click to upload PDF</span>
                        </div>
                      )}
                      <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" disabled={uploading} />
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Refer and Earn Offer</label>
                  <textarea rows={2} value={form.referAndEarn || ''} onChange={(e) => setForm({ ...form, referAndEarn: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm resize-none"
                    placeholder="e.g., Refer a student and earn ₹10,000 upon successful admission!" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Fees</label>
                    <input type="text" value={form.fees?.tuition || ''} onChange={(e) => setForm({ ...form, fees: { ...form.fees, tuition: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Fees</label>
                    <input type="text" value={form.fees?.hostel || ''} onChange={(e) => setForm({ ...form, fees: { ...form.fees, hostel: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Living Cost</label>
                    <input type="text" value={form.fees?.livingCost || ''} onChange={(e) => setForm({ ...form, fees: { ...form.fees, livingCost: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Courses (comma separated)</label>
                  <input type="text" value={form.courses} onChange={(e) => setForm({ ...form, courses: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" placeholder="Computer Science, MBA, Engineering" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Marks</label>
                    <input type="text" value={form.eligibility?.marks || ''} onChange={(e) => setForm({ ...form, eligibility: { ...form.eligibility, marks: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IELTS</label>
                    <input type="text" value={form.eligibility?.ielts || ''} onChange={(e) => setForm({ ...form, eligibility: { ...form.eligibility, ielts: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TOEFL</label>
                    <input type="text" value={form.eligibility?.toefl || ''} onChange={(e) => setForm({ ...form, eligibility: { ...form.eligibility, toefl: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Documents Required (comma separated)</label>
                  <input type="text" value={form.eligibility?.documents || ''} onChange={(e) => setForm({ ...form, eligibility: { ...form.eligibility, documents: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" placeholder="Transcripts, Passport, SOP" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input type="text" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-accent-500 focus:ring-accent-500" />
                  <label htmlFor="featured" className="text-sm text-gray-700">Featured University</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" disabled={saving}
                    className="flex-1 py-3 bg-accent-500 text-white rounded-xl font-semibold text-sm hover:bg-accent-600 transition-colors disabled:opacity-50">
                    {saving ? 'Saving...' : (editId ? 'Update University' : 'Add University')}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
                    className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-accent-200 border-t-accent-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-4 px-5 text-gray-400 font-medium">University</th>
                    <th className="text-left py-4 px-5 text-gray-400 font-medium">Country</th>
                    <th className="text-left py-4 px-5 text-gray-400 font-medium">Fees</th>
                    <th className="text-left py-4 px-5 text-gray-400 font-medium">Type</th>
                    <th className="text-left py-4 px-5 text-gray-400 font-medium">Featured</th>
                    <th className="text-right py-4 px-5 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {universities.map((uni) => (
                    <tr key={uni._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={uni.coverImage?.url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=100'}
                            alt={uni.universityName}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <span className="font-medium text-primary-900">{uni.universityName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-gray-500">{uni.country}</td>
                      <td className="py-4 px-5 text-gray-500">{uni.fees?.tuition}</td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium">{uni.degreeType}</span>
                      </td>
                      <td className="py-4 px-5">
                        {uni.featured ? (
                          <span className="px-2.5 py-1 bg-accent-50 text-accent-600 rounded-lg text-xs font-medium">⭐ Yes</span>
                        ) : (
                          <span className="text-gray-300 text-xs">No</span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(uni)}
                            className="p-2 hover:bg-accent-50 rounded-lg text-accent-600 transition-colors" title="Edit">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(uni._id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors" title="Delete">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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
