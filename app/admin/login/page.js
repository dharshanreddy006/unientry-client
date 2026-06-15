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
    <main className="min-h-screen bg-white flex">
      {/* Welcome panel — desktop */}
      <section className="hidden lg:flex lg:w-[44%] xl:w-[48%] relative overflow-hidden bg-white text-black border-r border-zinc-200">
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div>
            {logoUrl ? (
              <img
                src={getImageUrl(logoUrl)}
                alt="UniEntry"
                className="h-8 w-auto object-contain brightness-0"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-black tracking-[0.15em] uppercase">UniEntry</span>
              </div>
            )}
          </div>

          <div className="w-full text-center my-auto">
            <h1 className="font-serif text-[6.5rem] xl:text-[8rem] font-bold tracking-[0.2em] text-black uppercase leading-none select-none">
              WELCOME
            </h1>
            <p className="text-zinc-500 text-[10px] tracking-[0.35em] uppercase mt-4">
              UniEntry Administration Portal
            </p>
          </div>

          <p className="text-zinc-400 text-[10px] tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} UniEntry GLOBAL
          </p>
        </div>
      </section>

      {/* Login form */}
      <section className="flex-1 flex items-center justify-center px-5 py-12 sm:px-8 bg-white">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden mb-10 text-center">
            {logoUrl ? (
              <img src={getImageUrl(logoUrl)} alt="UniEntry" className="h-7 w-auto object-contain mx-auto mb-6 brightness-0" />
            ) : (
              <span className="font-serif font-bold text-lg text-black tracking-[0.15em] uppercase block mb-6">UniEntry</span>
            )}
            <h1 className="font-serif font-bold text-5xl text-black tracking-[0.15em] uppercase">WELCOME</h1>
            <p className="text-zinc-500 text-[10px] tracking-widest uppercase mt-2">Admin Portal</p>
          </div>

          <div className="hidden lg:block mb-8">
            <h2 className="text-sm font-semibold tracking-[0.25em] text-black uppercase">Sign In</h2>
            <p className="text-zinc-400 text-xs tracking-widest uppercase mt-1">Enter your credentials to continue</p>
          </div>

          <div className="border border-black p-8 sm:p-10 bg-white rounded-none shadow-none">
            {error && (
              <div className="mb-6 flex gap-3 p-4 bg-black border border-black text-white text-[11px] uppercase tracking-wider rounded-none">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-black text-[10px] font-semibold tracking-widest uppercase mb-2">
                  Email address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="w-full pl-11 pr-4 py-3.5 rounded-none bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:border-black focus:ring-0 outline-none transition-all text-xs tracking-wider font-medium"
                    placeholder="admin@unientry.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-black text-[10px] font-semibold tracking-widest uppercase mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="w-full pl-11 pr-12 py-3.5 rounded-none bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:border-black focus:ring-0 outline-none transition-all text-xs tracking-wider font-medium"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-black transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="w-full py-4 mt-2 bg-black hover:bg-zinc-900 text-white font-semibold rounded-none uppercase tracking-[0.2em] text-[10px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in to dashboard'
                )}
              </button>
            </form>
          </div>

          <p className="text-center mt-8">
            <Link href="/" className="hover:opacity-70 transition-opacity inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-black font-semibold underline">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
