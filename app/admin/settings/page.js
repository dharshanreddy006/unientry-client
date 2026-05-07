'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const API = 'https://unientry-server-production.up.railway.app/api' || 'http://localhost:5000/api';
  const token = typeof window !== 'undefined' ? localStorage.getItem('unientry_token') : '';
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API}/settings`);
        const data = await res.json();
        if (data.success) setSettings(data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`${API}/settings`, { method: 'PUT', headers, body: JSON.stringify(settings) });
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (loading || !settings) {
    return (
      <AdminShell title="Settings">
        <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-accent-200 border-t-accent-500 rounded-full animate-spin" /></div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Settings">
      <form onSubmit={handleSave} className="max-w-3xl space-y-8">
        {saved && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm animate-fade-in">
            ✅ Settings saved successfully!
          </div>
        )}

        {/* Contact Settings */}
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
          <h2 className="font-heading font-semibold text-lg text-primary-900 mb-5">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input type="text" value={settings.whatsappNumber || ''} onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" placeholder="919876543210" />
              <p className="text-xs text-gray-400 mt-1">Format: country code + number (no + or spaces)</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" value={settings.phone || ''} onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={settings.email || ''} onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" value={settings.address || ''} onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
          <h2 className="font-heading font-semibold text-lg text-primary-900 mb-5">Social Media Links</h2>
          <div className="space-y-4">
            {['facebook', 'instagram', 'twitter', 'linkedin', 'youtube'].map((platform) => (
              <div key={platform}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{platform}</label>
                <input type="url" value={settings.socialLinks?.[platform] || ''}
                  onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, [platform]: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm"
                  placeholder={`https://${platform}.com/unientry`} />
              </div>
            ))}
          </div>
        </div>

        {/* Homepage Content */}
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
          <h2 className="font-heading font-semibold text-lg text-primary-900 mb-5">Homepage Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
              <input type="text" value={settings.heroTitle || ''} onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
              <textarea rows={2} value={settings.heroSubtitle || ''} onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">About Text</label>
              <textarea rows={4} value={settings.aboutText || ''} onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm resize-none" />
            </div>
          </div>
        </div>

        {/* Save */}
        <button type="submit" disabled={saving}
          className="px-8 py-3.5 bg-accent-500 text-white rounded-xl font-semibold text-sm hover:bg-accent-600 transition-colors disabled:opacity-50 shadow-lg shadow-accent-500/20">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </AdminShell>
  );
}
