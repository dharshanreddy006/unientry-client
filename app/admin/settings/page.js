'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const API = 'https://unientry-server-production.up.railway.app/api';
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

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(field);
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
        setSettings({ ...settings, [field]: data.data.url });
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

        {/* About Page Content */}
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
          <h2 className="font-heading font-semibold text-lg text-primary-900 mb-5">About Page Content</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
              <textarea rows={3} value={settings.aboutMission || ''} onChange={(e) => setSettings({ ...settings, aboutMission: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vision</label>
              <textarea rows={3} value={settings.aboutVision || ''} onChange={(e) => setSettings({ ...settings, aboutVision: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm resize-none" />
            </div>

            {/* Stats Management */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Statistics</label>
                <button type="button" onClick={() => setSettings({ ...settings, stats: [...(settings.stats || []), { number: '0', label: 'New Stat' }] })}
                  className="text-accent-600 text-xs font-semibold hover:underline">+ Add Stat</button>
              </div>
              <div className="space-y-3">
                {(settings.stats || []).map((stat, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <input type="text" value={stat.number} onChange={(e) => {
                      const newStats = [...settings.stats];
                      newStats[idx].number = e.target.value;
                      setSettings({ ...settings, stats: newStats });
                    }} className="w-1/3 px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Number (e.g. 5000+)" />
                    <input type="text" value={stat.label} onChange={(e) => {
                      const newStats = [...settings.stats];
                      newStats[idx].label = e.target.value;
                      setSettings({ ...settings, stats: newStats });
                    }} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Label (e.g. Students)" />
                    <button type="button" onClick={() => {
                      const newStats = settings.stats.filter((_, i) => i !== idx);
                      setSettings({ ...settings, stats: newStats });
                    }} className="p-2 text-red-500">✕</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Management */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Team Members</label>
                <button type="button" onClick={() => setSettings({ ...settings, team: [...(settings.team || []), { name: '', role: '', initials: '' }] })}
                  className="text-accent-600 text-xs font-semibold hover:underline">+ Add Member</button>
              </div>
              <div className="space-y-4">
                {(settings.team || []).map((member, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
                    <button type="button" onClick={() => {
                      const newTeam = settings.team.filter((_, i) => i !== idx);
                      setSettings({ ...settings, team: newTeam });
                    }} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Name</label>
                        <input type="text" value={member.name} onChange={(e) => {
                          const newTeam = [...settings.team];
                          newTeam[idx].name = e.target.value;
                          setSettings({ ...settings, team: newTeam });
                        }} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Initials</label>
                        <input type="text" value={member.initials} maxLength={3} onChange={(e) => {
                          const newTeam = [...settings.team];
                          newTeam[idx].initials = e.target.value;
                          setSettings({ ...settings, team: newTeam });
                        }} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Role</label>
                      <input type="text" value={member.role} onChange={(e) => {
                        const newTeam = [...settings.team];
                        newTeam[idx].role = e.target.value;
                        setSettings({ ...settings, team: newTeam });
                      }} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Founder Section */}
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
          <h2 className="font-heading font-semibold text-lg text-primary-900 mb-5">Founder Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Founder Name</label>
              <input type="text" value={settings.founderName || ''} onChange={(e) => setSettings({ ...settings, founderName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Founder Role</label>
              <input type="text" value={settings.founderRole || ''} onChange={(e) => setSettings({ ...settings, founderRole: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Founder Message</label>
              <textarea rows={4} value={settings.founderMessage || ''} onChange={(e) => setSettings({ ...settings, founderMessage: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 outline-none text-sm resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Founder Image</label>
              <div className="flex items-center gap-4">
                {settings.founderImageUrl && (
                  <img src={settings.founderImageUrl} alt="Founder preview" className="w-20 h-20 rounded-xl object-cover border border-gray-200" />
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'founderImageUrl')}
                    disabled={uploading === 'founderImageUrl'}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-xl file:border-0
                      file:text-sm file:font-semibold
                      file:bg-accent-50 file:text-accent-700
                      hover:file:bg-accent-100 transition-all"
                  />
                  {uploading && <p className="text-sm text-accent-600 mt-2">Uploading image...</p>}
                </div>
              </div>
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
