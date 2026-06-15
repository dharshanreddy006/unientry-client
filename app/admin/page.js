'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('unientry_token');
    if (token) {
      router.push('/admin/dashboard');
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="w-10 h-10 border-[3px] border-slate-200 border-t-accent-500 rounded-full animate-spin" />
      <p className="text-slate-400 text-sm">Redirecting...</p>
    </div>
  );
}
