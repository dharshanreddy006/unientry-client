'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getImageUrl } from '@/lib/apiConfig';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.data?.logoUrl) {
          setLogoUrl(data.data.logoUrl);
        }
      } catch {
        // Keep default branding if settings are unavailable
      }
    };
    fetchLogo();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${'/api'}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('unientry_token', data.token);
        localStorage.setItem('unientry_admin', JSON.stringify(data.admin));
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex">
      {/* Welcome panel — desktop */}
      <section className="hidden lg:flex lg:w-[44%] xl:w-[48%] relative overflow-hidden bg-primary-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(14,165,233,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(56,189,248,0.12),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div>
            {logoUrl ? (
              <img
                src={getImageUrl(logoUrl)}
                alt="UniEntry"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                  <span className="font-heading font-bold text-lg text-white">U</span>
                </div>
                <span className="font-heading font-semibold text-xl tracking-tight">UniEntry</span>
              </div>
            )}
          </div>

          <div className="max-w-md">
            <p className="text-accent-400 text-sm font-semibold tracking-wide uppercase mb-4">
              Admin Portal
            </p>
            <h1 className="font-heading text-4xl xl:text-[2.75rem] font-bold leading-tight tracking-tight mb-5">
              Welcome back.
              <span className="block text-white/70 font-medium text-2xl xl:text-3xl mt-2">
                Manage your platform with confidence.
              </span>
            </h1>
            <p className="text-white/55 text-base leading-relaxed">
              Sign in to update universities, accommodations, inquiries, and site settings — all in one place.
            </p>
          </div>

          <p className="text-white/35 text-sm">
            © {new Date().getFullYear()} UniEntry GLOBAL
          </p>
        </div>
      </section>

      {/* Login form */}
      <section className="flex-1 flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden mb-10 text-center">
            {logoUrl ? (
              <img src={getImageUrl(logoUrl)} alt="UniEntry" className="h-9 w-auto object-contain mx-auto mb-4" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-primary-900 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-heading font-bold text-xl">U</span>
              </div>
            )}
            <h1 className="font-heading font-bold text-2xl text-primary-900 tracking-tight">Admin Login</h1>
            <p className="text-slate-500 text-sm mt-1.5">Sign in to your UniEntry dashboard</p>
          </div>

          <div className="hidden lg:block mb-8">
            <h2 className="font-heading font-bold text-2xl text-primary-900 tracking-tight">Sign in</h2>
            <p className="text-slate-500 text-sm mt-1.5">Enter your credentials to continue</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.06)] p-8 sm:p-9">
            {error && (
              <div className="mb-6 flex gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-slate-700 text-sm font-medium mb-2">
                  Email address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 outline-none transition-all text-sm"
                    placeholder="admin@unientry.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-slate-700 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 outline-none transition-all text-sm"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-1 bg-primary-900 hover:bg-primary-800 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in to dashboard'
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-slate-400 text-sm mt-8">
            <Link href="/" className="hover:text-accent-600 transition-colors inline-flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to website
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
