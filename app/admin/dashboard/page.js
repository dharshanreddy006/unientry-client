'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const adminData = localStorage.getItem('unientry_admin');
    if (adminData) {
      try {
        setAdmin(JSON.parse(adminData));
      } catch {
        // ignore parse errors
      }
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('unientry_token');
        const res = await fetch('/api/settings/stats', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
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

  const adminName = admin?.email?.split('@')[0] || 'Admin';
  const adminInitial = admin?.email?.charAt(0).toUpperCase() || 'A';

  const statCards = [
    {
      label: 'Universities',
      value: stats?.totalUniversities || 0,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      ),
    },
    {
      label: 'Internships',
      value: stats?.totalInternships || 0,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      ),
    },
    {
      label: 'Total Inquiries',
      value: stats?.totalInquiries || 0,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      ),
    },
    {
      label: 'New Inquiries',
      value: stats?.newInquiries || 0,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      ),
    },
  ];

  const quickActions = [
    {
      title: 'Universities',
      description: 'Manage university profiles, fees, and resources.',
      href: '/admin/universities',
      accent: 'from-accent-500 to-accent-600',
    },
    {
      title: 'Accommodations',
      description: 'Update student housing listings and images.',
      href: '/admin/accommodations',
      accent: 'from-primary-700 to-primary-900',
    },
  ];

  return (
    <AdminShell title="Dashboard">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 border-[3px] border-slate-200 border-t-accent-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading your dashboard...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Welcome banner */}
          <section className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.08),transparent_60%)]" />
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-900 text-white flex items-center justify-center font-heading font-bold text-xl flex-shrink-0 shadow-sm">
                  {adminInitial}
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">{formatDate()}</p>
                  <h2 className="font-heading font-bold text-2xl sm:text-[1.65rem] text-primary-900 tracking-tight">
                    {getGreeting()}, {adminName}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1.5 max-w-lg">
                    Here&apos;s an overview of your platform. Use the quick actions below to manage content.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 sm:flex-shrink-0">
                <Link
                  href="/admin/inquiries"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
                >
                  View inquiries
                  {(stats?.newInquiries || 0) > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                      {stats.newInquiries} new
                    </span>
                  )}
                </Link>
                <Link
                  href="/admin/settings"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-900 text-white text-sm font-medium hover:bg-primary-800 transition-colors"
                >
                  Site settings
                </Link>
              </div>
            </div>
          </section>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {card.icon}
                    </svg>
                  </div>
                </div>
                <p className="text-slate-500 text-sm">{card.label}</p>
                <p className="font-heading font-bold text-3xl text-primary-900 mt-1 tracking-tight">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group relative overflow-hidden rounded-2xl p-6 text-white shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.accent}`} />
                <div className="relative z-10">
                  <h3 className="font-heading font-bold text-xl mb-2">{action.title}</h3>
                  <p className="text-white/75 text-sm mb-5 max-w-[280px] leading-relaxed">{action.description}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 group-hover:gap-3 transition-all">
                    Open
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent inquiries */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-heading font-semibold text-lg text-primary-900">Recent Inquiries</h2>
                <p className="text-slate-500 text-sm mt-0.5">Latest student contact requests</p>
              </div>
              <Link href="/admin/inquiries" className="text-sm text-accent-600 hover:text-accent-700 font-medium">
                View all
              </Link>
            </div>

            {stats?.recentInquiries?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="text-left py-3.5 px-6 text-slate-500 font-medium">Student</th>
                      <th className="text-left py-3.5 px-6 text-slate-500 font-medium">Contact</th>
                      <th className="text-left py-3.5 px-6 text-slate-500 font-medium">University</th>
                      <th className="text-left py-3.5 px-6 text-slate-500 font-medium">Status</th>
                      <th className="text-left py-3.5 px-6 text-slate-500 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentInquiries.map((inquiry) => (
                      <tr key={inquiry._id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-6 font-medium text-primary-900">{inquiry.studentName}</td>
                        <td className="py-3.5 px-6">
                          <p className="text-slate-600">{inquiry.email}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{inquiry.phone}</p>
                        </td>
                        <td className="py-3.5 px-6 text-slate-600">{inquiry.interestedUniversity || 'General'}</td>
                        <td className="py-3.5 px-6">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${
                              inquiry.status === 'new'
                                ? 'bg-blue-50 text-blue-700'
                                : inquiry.status === 'contacted'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {inquiry.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-slate-500">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-14 px-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm">No inquiries yet</p>
                <p className="text-slate-400 text-xs mt-1">New student requests will appear here</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
