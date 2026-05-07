'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';

const emptyForm = { companyName: '', role: '', duration: '', stipend: '', description: '', skills: '', location: '', type: 'Remote', active: true };

export default function AdminInternships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || 'https://unientry-server-production.up.railway.app/api';
  const token = typeof window !== 'undefined' ? localStorage.getItem('unientry_token') : '';
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/internships/all`, { headers });
      const data = await res.json();
      if (data.success) setInternships(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInternships(); }, []);

  const handleEdit = (intern) => {
    setEditId(intern._id);
    setForm({ ...intern, skills: intern.skills?.join(', ') || '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this internship?')) return;
    try {
      await fetch(`${API}/internships/${id}`, { method: 'DELETE', headers });
      fetchInternships();
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) };
      const url = editId ? `${API}/internships/${editId}` : `${API}/internships`;
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) {
        setShowForm(false); setEditId(null); setForm(emptyForm); fetchInternships();
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <AdminShell title="Internship Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-500">{internships.length} internships total</p>
          <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
            className="px-5 py-2.5 bg-accent-500 text-white rounded-xl text-sm font-semibold hover:bg-accent-600 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Internship
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto">
            <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl my-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-semibold text-xl text-primary-900">{editId ? 'Edit' : 'Add'} Internship</h2>
                <button onClick={() => { setShowForm(false); setEditId(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                    <input type="text" required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                    <input type="text" required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                    <input type="text" required value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stipend</label>
                    <input type="text" value={form.stipend} onChange={(e) => setForm({ ...form, stipend: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm">
                      <option>Remote</option><option>On-site</option><option>Hybrid</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                  <input type="text" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" placeholder="React, Node.js, Python" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="active" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 rounded" />
                  <label htmlFor="active" className="text-sm text-gray-700">Active</label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="flex-1 py-3 bg-accent-500 text-white rounded-xl font-semibold text-sm hover:bg-accent-600 disabled:opacity-50">
                    {saving ? 'Saving...' : (editId ? 'Update' : 'Add Internship')}
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
                  <th className="text-left py-4 px-5 text-gray-400 font-medium">Company</th>
                  <th className="text-left py-4 px-5 text-gray-400 font-medium">Role</th>
                  <th className="text-left py-4 px-5 text-gray-400 font-medium">Stipend</th>
                  <th className="text-left py-4 px-5 text-gray-400 font-medium">Type</th>
                  <th className="text-left py-4 px-5 text-gray-400 font-medium">Status</th>
                  <th className="text-right py-4 px-5 text-gray-400 font-medium">Actions</th>
                </tr></thead>
                <tbody>
                  {internships.map((intern) => (
                    <tr key={intern._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-5 font-medium text-primary-900">{intern.companyName}</td>
                      <td className="py-4 px-5 text-gray-500">{intern.role}</td>
                      <td className="py-4 px-5 text-gray-500">{intern.stipend}</td>
                      <td className="py-4 px-5"><span className="px-2.5 py-1 bg-accent-50 text-accent-700 rounded-lg text-xs font-medium">{intern.type}</span></td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${intern.active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {intern.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(intern)} className="p-2 hover:bg-accent-50 rounded-lg text-accent-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={() => handleDelete(intern._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
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
