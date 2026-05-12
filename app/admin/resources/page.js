'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';

export default function ResourceAccessPage() {
  const [requests, setRequests] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [selectedUniId, setSelectedUniId] = useState('');

  const API = 'https://unientry-server-production.up.railway.app/api';
  const token = typeof window !== 'undefined' ? localStorage.getItem('unientry_token') : '';
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, uniRes] = await Promise.all([
        fetch(`${API}/resources/admin/requests`, { headers }),
        fetch(`${API}/universities?limit=100`)
      ]);
      const reqData = await reqRes.json();
      const uniData = await uniRes.json();
      
      if (reqData.success) setRequests(reqData.data);
      if (uniData.success) setUniversities(uniData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGrantAccess = async (email, universityId) => {
    try {
      const res = await fetch(`${API}/resources/admin/grant`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, universityId })
      });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRevokeAccess = async (email, universityId) => {
    if (typeof window !== 'undefined' && !window.confirm('Are you sure you want to revoke access?')) return;
    try {
      const res = await fetch(`${API}/resources/admin/revoke`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, universityId })
      });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualGrant = async (e) => {
    e.preventDefault();
    if (!emailInput || !selectedUniId) return;
    await handleGrantAccess(emailInput, selectedUniId);
    setEmailInput('');
    setSelectedUniId('');
  };

  const getUniName = (id) => {
    return universities.find(u => u.id === id || u._id === id)?.universityName || 'Unknown University';
  };

  return (
    <AdminShell title="Resource Access Management">
      <div className="space-y-8">
        {/* Manual Grant Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-heading font-bold text-lg mb-4">Grant Access Manually</h3>
          <form onSubmit={handleManualGrant} className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              placeholder="User Email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm"
              required
            />
            <select
              value={selectedUniId}
              onChange={(e) => setSelectedUniId(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm"
              required
            >
              <option value="">Select University</option>
              {universities.map(uni => (
                <option key={uni.id || uni._id} value={uni.id || uni._id}>{uni.universityName}</option>
              ))}
            </select>
            <button
              type="submit"
              className="px-6 py-3 bg-accent-500 text-white rounded-xl font-bold text-sm hover:bg-accent-600 transition-all"
            >
              Grant Access
            </button>
          </form>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">User Email</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">University</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Requested At</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="w-8 h-8 border-2 border-accent-200 border-t-accent-500 rounded-full animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : requests.length > 0 ? (
                  requests.map((req) => (
                    <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-primary-900">{req.email}</td>
                      <td className="py-4 px-6 text-gray-500">{getUniName(req.universityId)}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                          req.status === 'granted' 
                            ? 'bg-green-50 text-green-600' 
                            : 'bg-yellow-50 text-yellow-600 animate-pulse'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-400 text-xs">
                        {new Date(req.createdAt).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {req.status === 'pending' ? (
                          <button
                            onClick={() => handleGrantAccess(req.email, req.universityId)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-all"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRevokeAccess(req.email, req.universityId)}
                            className="px-4 py-2 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-20 text-center text-gray-400">
                      No resource access requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
