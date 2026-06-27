'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetPassword } = useAuth();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('input'); // 'input' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('No password reset token was found in the URL link.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await resetPassword(token, password);
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password. The link may have expired.');
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
            Reset Password
          </p>
        </div>

        {status === 'input' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-xs text-zinc-500 text-center mb-4">
              Enter your new secure password below to update your account credentials.
            </p>

            {errorMsg && (
              <div className="p-4 bg-red-50 text-red-600 text-xs font-semibold tracking-wide text-center">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-black text-[10px] font-bold tracking-widest uppercase mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                    className="w-full px-4 py-3.5 bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:border-black focus:ring-0 outline-none transition-all text-xs tracking-wider font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-black text-[10px] font-bold tracking-widest uppercase mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3.5 bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:border-black focus:ring-0 outline-none transition-all text-xs tracking-wider font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-pass"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="w-4.5 h-4.5 text-black border-zinc-300 rounded-none focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="show-pass" className="ml-2 text-[10px] text-zinc-500 font-bold uppercase tracking-wider cursor-pointer">
                Show Passwords
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-black hover:bg-zinc-900 text-white font-semibold rounded-none uppercase tracking-[0.2em] text-[10px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        {status === 'success' && (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-sm font-extrabold text-black uppercase tracking-wider mb-2">
              Password Reset Completed
            </h2>
            <p className="text-xs text-zinc-500 tracking-wide mb-6">
              Your password has been changed successfully. You can now close this tab or return to the main page to sign in.
            </p>
            <Link href="/" className="inline-block py-3 px-6 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-900 transition-colors">
              Back to Home
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-sm font-extrabold text-black uppercase tracking-wider mb-2">
              Invalid or Expired Link
            </h2>
            <p className="text-xs text-red-600 font-medium tracking-wide mb-6">
              {errorMsg}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-zinc-200 border-t-black rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
