'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const API = '/api';
  const token = typeof window !== 'undefined' ? localStorage.getItem('unientry_token') : '';
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter) params.append('status', filter);
      const res = await fetch(`${API}/inquiry/all?${params}`, { headers });
      const data = await res.json();
      if (data.success) setInquiries(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInquiries(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API}/inquiry/${id}`, { method: 'PUT', headers, body: JSON.stringify({ status }) });
      fetchInquiries();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      await fetch(`${API}/inquiry/${id}`, { method: 'DELETE', headers });
      fetchInquiries();
    } catch (err) { console.error(err); }
  };

  return (
    <AdminShell title="Inquiry Management">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          {['', 'new', 'contacted', 'resolved'].map((status) => (
            <button key={status} onClick={() => setFilter(status)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filter === status ? 'bg-accent-500 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}>
              {status === '' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-accent-200 border-t-accent-500 rounded-full animate-spin" /></div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-gray-400">No inquiries found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-5 text-gray-400 font-medium">Student</th>
                  <th className="text-left py-4 px-5 text-gray-400 font-medium">Contact</th>
                  <th className="text-left py-4 px-5 text-gray-400 font-medium">University</th>
                  <th className="text-left py-4 px-5 text-gray-400 font-medium">Message</th>
                  <th className="text-left py-4 px-5 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-4 px-5 text-gray-400 font-medium">Date</th>
                  <th className="text-right py-4 px-5 text-gray-400 font-medium">Actions</th>
                </tr></thead>
                <tbody>
                  {inquiries.map((inq) => (
                    <tr key={inq._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-5 font-medium text-primary-900">{inq.studentName}</td>
                      <td className="py-4 px-5">
                        <p className="text-gray-500 text-xs">{inq.email}</p>
                        <p className="text-gray-500 text-xs">{inq.phone}</p>
                      </td>
                      <td className="py-4 px-5 text-gray-500 text-xs max-w-[120px] truncate">{inq.interestedUniversity || 'General'}</td>
                      <td className="py-4 px-5 text-gray-500 text-xs max-w-[200px] truncate">{inq.message || '-'}</td>
                      <td className="py-4 px-5">
                        <select value={inq.status} onChange={(e) => updateStatus(inq._id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer ${
                            inq.status === 'new' ? 'bg-blue-50 text-blue-600' :
                            inq.status === 'contacted' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'
                          }`}>
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="py-4 px-5 text-gray-400 text-xs">{new Date(inq.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(inq.studentName)},%20this%20is%20UniEntry.%20We%20received%20your%20inquiry.`}
                            target="_blank" rel="noopener noreferrer"
                            className="p-2 hover:bg-green-50 rounded-lg text-green-600" title="WhatsApp">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                          </a>
                          <button onClick={() => handleDelete(inq._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500" title="Delete">
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
