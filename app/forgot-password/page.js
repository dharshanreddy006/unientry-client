'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('input'); // 'input' | 'success'
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      await forgotPassword(email);
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send password reset email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-zinc-200 p-8 md:p-12 shadow-sm rounded-none">
        <div className="text-center mb-8">
          <h1 className="text-[20px] font-bold tracking-widest uppercase text-black">
            UniEntry Global
          </h1>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
            Forgot Password
          </p>
        </div>

        {status === 'input' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-xs text-zinc-500 leading-relaxed text-center mb-4">
              Enter your email address below and we will send you a secure link to reset your account password.
            </p>

            {errorMsg && (
              <div className="p-4 bg-red-50 text-red-600 text-xs font-semibold tracking-wide text-center">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-black text-[10px] font-bold tracking-widest uppercase mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="w-full px-4 py-3.5 bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:border-black focus:ring-0 outline-none transition-all text-xs tracking-wider font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-black hover:bg-zinc-900 text-white font-semibold uppercase tracking-[0.2em] text-[10px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? 'Sending Link...' : 'Send Reset Link'}
            </button>

            <div className="text-center pt-2">
              <Link href="/" className="text-[10px] text-zinc-500 hover:text-black font-bold uppercase tracking-wider underline">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}

        {status === 'success' && (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-sm font-extrabold text-black uppercase tracking-wider mb-2">
              Reset Link Sent
            </h2>
            <p className="text-xs text-zinc-500 tracking-wide mb-6">
              If an account is associated with <strong>{email}</strong>, we have sent a secure password reset link. Please check your inbox.
            </p>
            <Link href="/" className="inline-block py-3 px-6 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-900 transition-colors">
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
