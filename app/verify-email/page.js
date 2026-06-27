'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmail, resendVerification } = useAuth();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error' | 'resend-sent'
  const [errorMsg, setErrorMsg] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('No verification token was found in the URL link.');
      return;
    }

    const doVerification = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } catch (err) {
        setStatus('error');
        setErrorMsg(err.message || 'Invalid or expired verification link.');
      }
    };

    doVerification();
  }, [token, verifyEmail, router]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      await resendVerification(email);
      setStatus('resend-sent');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend verification email.');
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
            Email Verification
          </p>
        </div>

        {status === 'verifying' && (
          <div className="flex flex-col items-center justify-center py-6 gap-4">
            <div className="w-8 h-8 border-3 border-zinc-200 border-t-black rounded-full animate-spin" />
            <p className="text-xs text-zinc-600 font-medium tracking-wider uppercase">
              Verifying your email address...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-sm font-extrabold text-black uppercase tracking-wider mb-2">
              Email Verified Successfully!
            </h2>
            <p className="text-xs text-zinc-500 tracking-wide mb-6">
              Thank you for verifying your email. Redirecting you to the home page...
            </p>
            <Link href="/" className="inline-block py-3 px-6 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-900 transition-colors">
              Go to Home Page
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-sm font-extrabold text-black uppercase tracking-wider mb-2">
                Verification Failed
              </h2>
              <p className="text-xs text-red-600 font-medium tracking-wide mb-4">
                {errorMsg}
              </p>
            </div>

            <div className="border-t border-zinc-100 pt-6">
              <p className="text-xs text-zinc-500 mb-4 text-center">
                Need a new verification link? Enter your email below to resend:
              </p>
              <form onSubmit={handleResend} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    className="w-full px-4 py-3 bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:border-black focus:ring-0 outline-none transition-all text-xs tracking-wider font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-black hover:bg-zinc-900 text-white font-semibold uppercase tracking-[0.2em] text-[10px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? 'Sending...' : 'Resend Verification'}
                </button>
              </form>
            </div>
          </div>
        )}

        {status === 'resend-sent' && (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-sm font-extrabold text-black uppercase tracking-wider mb-2">
              Verification Email Sent
            </h2>
            <p className="text-xs text-zinc-500 tracking-wide mb-6">
              A new verification link has been sent to your email. Please check your inbox.
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-zinc-200 border-t-black rounded-full animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
