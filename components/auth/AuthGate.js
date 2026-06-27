'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useSettings } from '@/components/providers/SettingsProvider';
import { getImageUrl } from '@/lib/apiConfig';
import Link from 'next/link';

export default function AuthGate({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAuthenticated, login, signup, resendVerification, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'registered'
  const settings = useSettings();

  // Skip auth gate for admin routes (admin has its own auth)
  const isAdminRoute = pathname?.startsWith('/admin');
  
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);

  // Unverified resend state
  const [isUnverified, setIsUnverified] = useState(false);
  const [resendSubmitting, setResendSubmitting] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Welcome animation overlay
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  if (isAdminRoute) return children;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsUnverified(false);
    setResendSuccess(false);
    setSubmitting(true);
    try {
      const userData = await login(email, password);
      setWelcomeName(userData.name);
      setShowWelcome(true);
    } catch (err) {
      if (err.unverified) {
        setIsUnverified(true);
      }
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setSubmitting(true);
    try {
      await signup(name, email, '', password, role);
      setMode('registered');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendLink = async () => {
    setResendSubmitting(true);
    setError('');
    try {
      await resendVerification(email);
      setResendSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to resend verification email.');
    } finally {
      setResendSubmitting(false);
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
          <img src={settings?.logoUrl ? getImageUrl(settings.logoUrl) : "/logo.png"} alt="UniEntry Global" className="w-16 h-16 animate-pulse" />
          <div className="w-8 h-8 border-3 border-zinc-200 border-t-black rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Welcome animation overlay
  if (showWelcome) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999] transition-all duration-500">
        <div className="text-center px-4 max-w-md animate-fade-in">
          <div className="text-[10px] text-zinc-400 font-extrabold tracking-[0.3em] uppercase mb-4">
            Welcome to
          </div>
          <h2 className="text-white text-3xl font-light tracking-[0.25em] uppercase mb-2">
            UniEntry Global
          </h2>
          <div className="h-[1px] w-20 bg-zinc-700 mx-auto my-6" />
          <p className="text-zinc-300 text-sm tracking-wider font-light">
            Signing you in as <span className="font-semibold text-white">{welcomeName}</span>
          </p>
        </div>
      </div>
    );
  }

  // If authenticated, render children
  if (isAuthenticated && user) {
    return children;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background graphic elements */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-black" />
      
      {/* Brand Header */}
      <div className="mb-8 text-center" style={{ animation: 'fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <h1 className="text-[24px] font-extrabold tracking-[0.3em] uppercase text-black select-none">
          UniEntry Global
        </h1>
        <p className="text-[10px] text-zinc-400 font-bold tracking-[0.2em] uppercase mt-2">
          Global Student Entrance Portal
        </p>
      </div>

      <div className="w-full max-w-md bg-white border border-zinc-200 p-8 md:p-12 shadow-sm relative"
        style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {mode !== 'registered' && (
          <>
            {/* Tab toggle */}
            <div className="flex border-b border-zinc-200 mb-6">
              <button
                onClick={() => { setMode('login'); setError(''); setIsUnverified(false); setResendSuccess(false); }}
                className={`flex-1 py-3 text-center text-[10px] font-bold tracking-widest uppercase transition-all ${
                  mode === 'login'
                    ? 'border-b-2 border-black text-black font-extrabold'
                    : 'text-zinc-400 hover:text-black'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode('signup'); setError(''); setIsUnverified(false); setResendSuccess(false); }}
                className={`flex-1 py-3 text-center text-[10px] font-bold tracking-widest uppercase transition-all ${
                  mode === 'signup'
                    ? 'border-b-2 border-black text-black font-extrabold'
                    : 'text-zinc-400 hover:text-black'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-semibold tracking-wide flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
                {isUnverified && (
                  <button
                    type="button"
                    onClick={handleResendLink}
                    disabled={resendSubmitting}
                    className="text-[10px] text-zinc-800 hover:text-black font-bold uppercase tracking-wider underline text-left mt-1"
                  >
                    {resendSubmitting ? 'Resending Link...' : 'Resend Verification Email'}
                  </button>
                )}
              </div>
            )}

            {/* Resend Success Message */}
            {resendSuccess && (
              <div className="mb-6 p-4 bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs font-semibold tracking-wide text-center">
                New verification email sent successfully. Please check your inbox.
              </div>
            )}

            {/* Social Login */}
            <div>
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={submitting}
                className="w-full py-3.5 border border-zinc-200 hover:bg-zinc-50 bg-white rounded-none transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.87-4.53-5.01-4.53z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
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
          </>
        )}

        {/* LOGIN Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-black text-[10px] font-bold tracking-widest uppercase mb-2">
                Email Address
              </label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-none bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:border-black focus:ring-0 outline-none transition-all text-xs tracking-wider font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-black text-[10px] font-bold tracking-widest uppercase">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[9px] text-zinc-400 hover:text-black font-extrabold uppercase tracking-wider transition-colors">
                  Forgot Password?
                </Link>
              </div>
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
              className="w-full py-4 bg-black hover:bg-zinc-900 text-white font-semibold rounded-none uppercase tracking-[0.2em] text-[10px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required
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

        {/* Signup Success Screen */}
        {mode === 'registered' && (
          <div className="text-center py-6 animate-fade-in">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-sm font-extrabold text-black uppercase tracking-wider mb-2">
              Registration Successful!
            </h2>
            <p className="text-xs text-zinc-500 tracking-wide mb-6 leading-relaxed">
              We have sent an email verification link to <strong className="text-black">{email}</strong>. Please verify your email to activate and sign in to your account.
            </p>
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className="w-full py-3.5 bg-black hover:bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>

      {/* Footer text */}
      <p className="text-zinc-400 text-[10px] tracking-widest uppercase text-center mt-6"
        style={{ animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both' }}
      >
        By continuing, you agree to UniEntry Global&apos;s Terms of Service
      </p>
    </div>
  );
}
