'use client';

import { useState } from 'react';
import { useSettings } from '@/components/providers/SettingsProvider';
import { API_URL } from '@/lib/apiConfig';

export default function ContactSection() {
  const settings = useSettings();
  const [form, setForm] = useState({
    studentName: '',
    email: '',
    phone: '',
    interestedUniversity: '',
    message: '',
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });
  
  // AI Assistant States
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hi! I am your UniEntry AI Assistant. I can help explain our student services and show you step-by-step how everything works. What would you like to know?',
    }
  ]);

  const handleQuery = (queryText) => {
    if (!queryText.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: queryText };
    setMessages(prev => [...prev, userMsg]);

    // Generate AI response
    setTimeout(() => {
      let responseText = '';
      const query = queryText.toLowerCase();

      if (query.includes('marketplace') || query.includes('shop') || query.includes('sell') || query.includes('buy')) {
        responseText = `🛍️ **UniEntry Student Marketplace Guide:**\n\n` +
          `Our Marketplace lets students buy and sell second-hand textbooks, electronics, and daily essentials within the campus community.\n\n` +
          `**How it works step-by-step:**\n` +
          `1. Go to the **Shop** tab on the mobile navigation bar.\n` +
          `2. Browse or search listed products.\n` +
          `3. Click on any item card to see verification badges and price details.\n` +
          `4. Click the "Chat on WhatsApp" button to connect directly with the student seller to finalize payment and pick-up.`;
      } else if (query.includes('accommodation') || query.includes('stay') || query.includes('flat') || query.includes('room') || query.includes('hostel')) {
        responseText = `🏠 **UniEntry Stay & Accommodation Guide:**\n\n` +
          `We offer curated, student-friendly accommodation options near partner universities.\n\n` +
          `**How it works step-by-step:**\n` +
          `1. Go to the **Stay** tab on the navigation bar.\n` +
          `2. Filter by location or university name.\n` +
          `3. Browse verified apartments, single rooms, or shared PG hostels.\n` +
          `4. Click on a property to see photos, distance to campus, and amenities.\n` +
          `5. Fill out the instant inquiry form or chat directly with the stay coordinator to book your room.`;
      } else if (query.includes('rent') || query.includes('ride') || query.includes('vehicle') || query.includes('bike') || query.includes('cycle') || query.includes('scooter')) {
        responseText = `🚲 **UniEntry Rent & Ride Guide:**\n\n` +
          `Rent budget-friendly cycles, electric scooters, or motorbikes for easy daily commuting around your campus.\n\n` +
          `**How it works step-by-step:**\n` +
          `1. Go to the **Ride** tab on the bottom nav bar.\n` +
          `2. Browse available vehicles near your campus.\n` +
          `3. Check rates per hour, day, or week.\n` +
          `4. Click "Reserve" to submit a ride request.\n` +
          `5. Pick up the vehicle keys from the designated campus point after completing the verification check.`;
      } else if (query.includes('refer') || query.includes('earn') || query.includes('reward') || query.includes('money') || query.includes('commission')) {
        responseText = `🤝 **UniEntry Refer & Earn Guide:**\n\n` +
          `Earn payouts by helping friends find university admission guidance and college entry assistance.\n\n` +
          `**How it works step-by-step:**\n` +
          `1. Access the **Refer** tab on the mobile bar.\n` +
          `2. Generate your personal referral code.\n` +
          `3. Share your referral code or link with friends looking for college admissions.\n` +
          `4. Once they register and complete their enrollment process, your reward wallet will receive direct cash payouts.`;
      } else if (query.includes('hi') || query.includes('hello') || query.includes('hey') || query.includes('help')) {
        responseText = `👋 Hello! I'm here to help you get started with UniEntry. \n\nWe provide 4 primary student services:\n` +
          `1. **Marketplace** (Shop second-hand items)\n` +
          `2. **Stay** (Student rooms & PG listings)\n` +
          `3. **Ride** (Campus cycle/scooter rentals)\n` +
          `4. **Refer** (Earn payouts for admissions)\n\n` +
          `Type any service name or click the suggestions below to view a step-by-step guide!`;
      } else {
        responseText = `💡 **I can certainly help you with that!**\n\n` +
          `To learn more, here are the step-by-step guides for our core services:\n` +
          `- Ask about **"Marketplace"** to learn how to buy or sell items.\n` +
          `- Ask about **"Accommodation"** to learn how to find student rooms.\n` +
          `- Ask about **"Rent & Ride"** to rent cycles/scooters.\n` +
          `- Ask about **"Refer & Earn"** to generate referral rewards.\n\n` +
          `Or click on any of the quick suggestion buttons below!`;
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: responseText }]);
    }, 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      const res = await fetch(`${API_URL}/inquiry/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setStatus({ loading: false, success: true, error: '' });
        setForm({ studentName: '', email: '', phone: '', interestedUniversity: '', message: '' });
      } else {
        setStatus({ loading: false, success: false, error: data.message });
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <section className="section-padding bg-white" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Info */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-50 text-accent-600 text-sm font-medium mb-4">
              📞 Get in Touch
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-900 mb-4">
              Start Your Journey Today
            </h2>

            {/* Contact details */}
            <div className="space-y-5 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a href={`mailto:${settings?.email}`} className="text-primary-900 font-medium hover:text-accent-600 transition-colors">{settings?.email}</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <a href={`tel:${settings?.phone}`} className="text-primary-900 font-medium hover:text-accent-600 transition-colors">{settings?.phone}</a>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <a
                href={`https://wa.me/${settings?.whatsappNumber}?text=Hi%20UniEntry!%20I%20would%20like%20to%20inquire%20about%20your%20services%20(Marketplace,%20Accommodation,%20Rent%20%26%20Ride,%20Refer%20%26%20Earn)%20or%20submit%20a%20query.`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs md:text-sm shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>

              <button
                onClick={() => setIsAssistantOpen(true)}
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs md:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg hover:from-blue-700 hover:to-indigo-700"
              >
                <svg className="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Ask AI Assistant
              </button>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <h3 className="font-heading font-semibold text-xl text-primary-900 mb-6">Send us a Message</h3>

            {status.success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                ✅ Your inquiry has been submitted! We&apos;ll contact you soon.
              </div>
            )}
            {status.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                ❌ {status.error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.studentName}
                  onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 outline-none transition-all text-sm bg-white"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 outline-none transition-all text-sm bg-white"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 outline-none transition-all text-sm bg-white"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Interested University</label>
                <input
                  type="text"
                  value={form.interestedUniversity}
                  onChange={(e) => setForm({ ...form, interestedUniversity: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 outline-none transition-all text-sm bg-white"
                  placeholder="e.g., University of Oxford"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 outline-none transition-all text-sm bg-white resize-none"
                  placeholder="Tell us about your goals..."
                />
              </div>
              <button
                type="submit"
                disabled={status.loading}
                className="w-full py-3.5 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {status.loading ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* AI Assistant Modal */}
      {isAssistantOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl flex flex-col h-[550px] border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg leading-tight">UniEntry Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[10px] text-blue-100 font-bold uppercase tracking-wider">Online Support</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsAssistantOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                  }`}>
                    {msg.text.split('\n').map((line, idx) => (
                      <p key={idx} className={idx > 0 ? 'mt-1' : ''}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-6 py-3 bg-white border-t border-slate-100 flex flex-wrap gap-2 overflow-x-auto">
              {[
                { label: '🛍️ Marketplace', query: 'Tell me about Marketplace and how it works' },
                { label: '🏠 Accommodation', query: 'How does Stay Accommodation work?' },
                { label: '🚲 Rent & Ride', query: 'Explain the Rent and Ride service' },
                { label: '🤝 Refer & Earn', query: 'How do I refer friends and earn payouts?' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleQuery(chip.query)}
                  className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-xs font-semibold text-slate-600 transition-all border border-slate-200/60"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleQuery(inputText);
                setInputText('');
              }}
              className="p-4 bg-white border-t border-slate-100 flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask how services work..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm bg-slate-50 transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
