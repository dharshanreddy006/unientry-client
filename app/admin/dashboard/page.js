'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('unientry_token');
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://unientry-server-production.up.railway.app/api'}/settings/stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data.success) setStats(data.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Universities', value: stats?.totalUniversities || 0, icon: '🎓', color: 'from-blue-500 to-blue-600' },
    { label: 'Total Internships', value: stats?.totalInternships || 0, icon: '💼', color: 'from-purple-500 to-purple-600' },
    { label: 'Total Inquiries', value: stats?.totalInquiries || 0, icon: '📩', color: 'from-green-500 to-green-600' },
    { label: 'New Inquiries', value: stats?.newInquiries || 0, icon: '🔔', color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <AdminShell title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-accent-200 border-t-accent-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card) => (
              <div key={card.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{card.icon}</span>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">{card.value}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">{card.label}</p>
                <p className="font-heading font-bold text-2xl text-primary-900 mt-1">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Inquiries */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-heading font-semibold text-lg text-primary-900 mb-4">Recent Inquiries</h2>
            {stats?.recentInquiries?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Student</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">University</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentInquiries.map((inquiry) => (
                      <tr key={inquiry._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-primary-900">{inquiry.studentName}</td>
                        <td className="py-3 px-4 text-gray-500">{inquiry.email}</td>
                        <td className="py-3 px-4 text-gray-500">{inquiry.interestedUniversity || 'General'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                            inquiry.status === 'new' ? 'bg-blue-50 text-blue-600' :
                            inquiry.status === 'contacted' ? 'bg-yellow-50 text-yellow-600' :
                            'bg-green-50 text-green-600'
                          }`}>
                            {inquiry.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No inquiries yet</p>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
