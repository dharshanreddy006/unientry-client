'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useSettings } from '@/components/providers/SettingsProvider';
import { getImageUrl } from '@/lib/apiConfig';

export default function AuthGate({ children }) {
  const pathname = usePathname();
  const { user, loading, isAuthenticated, login, signup, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const settings = useSettings();

  // Skip auth gate for admin routes (admin has its own auth)
  const isAdminRoute = pathname?.startsWith('/admin');
  if (isAdminRoute) return children;
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);

  // Welcome animation on login/signup
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const userData = await login(identifier, password);
      setWelcomeName(userData.name);
      setShowWelcome(true);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!email && !phone) {
      setError('Please enter email or phone number');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setSubmitting(true);
    try {
      const userData = await signup(name, email, phone, password, role);
      setWelcomeName(userData.name);
      setShowWelcome(true);
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setSubmitting(true);
    try {
      const userData = await loginWithGoogle(role);
      setWelcomeName(userData.name);
      setShowWelcome(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Google authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-[9999]">
        <div className="flex flex-col items-center gap-4">
          <img src={settings?.logoUrl ? getImageUrl(settings.logoUrl) : "/logo.png"} alt="UniEntry GLOBAL" className="w-16 h-16 animate-pulse" />
          <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Welcome animation overlay
  if (showWelcome) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-white">
        <div className="relative z-10 text-center px-6"
          style={{ animation: 'welcomeEntry 0.8s cubic-bezier(0.16, 1, 0.3, 1) both' }}
        >
          {/* Checkmark circle */}
          <div className="mx-auto w-16 h-16 border border-black flex items-center justify-center mb-6 rounded-none"
            style={{ animation: 'welcomeCheck 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both' }}
          >
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"
                style={{
                  strokeDasharray: 24,
                  strokeDashoffset: 24,
                  animation: 'drawCheck 0.5s ease-out 0.6s forwards',
                }}
              />
            </svg>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-black uppercase tracking-[0.2em] mb-3"
            style={{ animation: 'welcomeText 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both' }}
          >
            Welcome, {welcomeName}
          </h1>
          <p className="text-zinc-500 text-[10px] tracking-[0.2em] uppercase"
            style={{ animation: 'welcomeText 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both' }}
          >
            Loading your experience
          </p>

          {/* Loading bar */}
          <div className="mt-8 w-48 h-[1px] bg-zinc-200 mx-auto overflow-hidden rounded-none">
            <div className="h-full bg-black"
              style={{ animation: 'welcomeBar 1.8s ease-out 0.5s both' }}
            />
          </div>
        </div>

        <style jsx>{`
          @keyframes welcomeEntry {
            from { opacity: 0; transform: scale(0.9) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes welcomeCheck {
            from { opacity: 0; transform: scale(0); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes drawCheck {
            to { stroke-dashoffset: 0; }
          }
          @keyframes welcomeText {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes welcomeBar {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  // If authenticated, show the app
  if (isAuthenticated) {
    return children;
  }

  // Login / Signup screen
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-white">
      <div className="relative z-10 w-full max-w-[420px] mx-4 my-8">
        {/* WELCOME header */}
        <div className="text-center mb-8" style={{ animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
          <h1 className="font-serif text-[4.5rem] font-bold tracking-[0.2em] text-black uppercase leading-none select-none mb-6">
            WELCOME
          </h1>
          <div className="inline-flex items-center gap-2 mb-2">
            {settings?.logoUrl ? (
              <img src={getImageUrl(settings.logoUrl)} alt="UniEntry" className="h-6 w-auto object-contain brightness-0" />
            ) : (
              <span className="font-serif font-bold text-xs text-black tracking-[0.15em] uppercase">UniEntry GLOBAL</span>
            )}
          </div>
          <p className="text-zinc-500 text-[10px] tracking-widest uppercase mt-1">
            {mode === 'login' ? 'Sign in to continue' : 'Create your account'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-black p-6 sm:p-8 rounded-none shadow-none"
          style={{ animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both' }}
        >
          {/* Tab toggle */}
          <div className="flex border-b border-zinc-200 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-3 text-center text-[10px] font-bold tracking-widest uppercase transition-all ${
                mode === 'login'
                  ? 'border-b-2 border-black text-black font-extrabold'
                  : 'text-zinc-400 hover:text-black'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-3 text-center text-[10px] font-bold tracking-widest uppercase transition-all ${
                mode === 'signup'
                  ? 'border-b-2 border-black text-black font-extrabold'
                  : 'text-zinc-400 hover:text-black'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex gap-3 p-4 bg-black border border-black text-white text-[11px] uppercase tracking-wider rounded-none"
              style={{ animation: 'fadeInUp 0.3s ease both' }}
            >
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Google Authentication Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white/40 hover:bg-white/60 active:scale-[0.98] border border-white/20 backdrop-blur-md shadow-sm transition-all duration-300 group cursor-pointer"
            >
              {submitting ? (
                <div className="w-4.5 h-4.5 border-2 border-zinc-400 border-t-black rounded-full animate-spin" />
              ) : (
                <svg className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.69c-.29 1.5-.1.13-1.14 2.19l3.51 2.73c2.05-1.9 3.68-4.7 3.68-8.75z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.51-2.73c-1-.67-2.28-1.07-3.47-1.07-2.67 0-4.93-1.8-5.74-4.22L3.6 15.82C5.58 19.74 9.64 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M6.26 13.07a7.12 7.12 0 010-4.51L3.6 5.82c-.88 1.76-1.38 3.73-1.38 5.79 0 2.06.5 4.03 1.38 5.79l2.66-2.33z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 9.64 0 5.58 4.26 3.6 8.18l2.66 2.33c.81-2.42 3.07-4.22 5.74-4.22z"
                  />
                </svg>
              )}
              <span className="text-zinc-800 text-xs font-bold tracking-wider uppercase transition-colors group-hover:text-black">
                {mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}
              </span>
            </button>
            
            {/* Subtle Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="h-[1px] flex-1 bg-zinc-200" />
              <span className="text-[10px] text-zinc-400 font-extrabold tracking-widest uppercase">OR</span>
              <div className="h-[1px] flex-1 bg-zinc-200" />
            </div>
          </div>

          {/* LOGIN Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-black text-[10px] font-bold tracking-widest uppercase mb-2">
                  Email or Phone
                </label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="you@email.com or 9876543210"
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-none bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:border-black focus:ring-0 outline-none transition-all text-xs tracking-wider font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-black text-[10px] font-bold tracking-widest uppercase mb-2">
                  Password
                </label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-11 pr-12 py-3.5 rounded-none bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:border-black focus:ring-0 outline-none transition-all text-xs tracking-wider font-medium"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-black transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
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
                disabled={submitting}
                className="w-full py-4 mt-2 bg-black hover:bg-zinc-900 text-white font-semibold rounded-none uppercase tracking-[0.2em] text-[10px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </form>
          )}

          {/* SIGNUP Form */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <label className="block text-black text-[10px] font-bold tracking-widest uppercase mb-2">Full Name</label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required
                    className="w-full pl-11 pr-4 py-3.5 rounded-none bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:border-black focus:ring-0 outline-none transition-all text-xs tracking-wider font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-black text-[10px] font-bold tracking-widest uppercase mb-2">Email</label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com (optional if phone given)"
                    className="w-full pl-11 pr-4 py-3.5 rounded-none bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:border-black focus:ring-0 outline-none transition-all text-xs tracking-wider font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-black text-[10px] font-bold tracking-widest uppercase mb-2">Phone Number</label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210 (optional if email given)"
                    className="w-full pl-11 pr-4 py-3.5 rounded-none bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:border-black focus:ring-0 outline-none transition-all text-xs tracking-wider font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-black text-[10px] font-bold tracking-widest uppercase mb-2">Password</label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6}
                    className="w-full pl-11 pr-12 py-3.5 rounded-none bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:border-black focus:ring-0 outline-none transition-all text-xs tracking-wider font-medium"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
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

              {/* Role selection */}
              <div>
                <label className="block text-black text-[10px] font-bold tracking-widest uppercase mb-2">I am a</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'student', label: 'Student', icon: '🎓' },
                    { value: 'business', label: 'Business', icon: '💼' },
                    { value: 'university_official', label: 'Official', icon: '🏛️' },
                  ].map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-none border-2 transition-all duration-200 text-xs font-semibold ${
                        role === r.value
                          ? 'border-black bg-black text-white'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-black'
                      }`}
                    >
                      <span className="text-lg">{r.icon}</span>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 mt-2 bg-black hover:bg-zinc-900 text-white font-semibold rounded-none uppercase tracking-[0.2em] text-[10px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        {/* Footer text */}
        <p className="text-zinc-400 text-[10px] tracking-widest uppercase text-center mt-6"
          style={{ animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both' }}
        >
          By continuing, you agree to UniEntry GLOBAL&apos;s Terms of Service
        </p>
      </div>
    </div>
  );
}
