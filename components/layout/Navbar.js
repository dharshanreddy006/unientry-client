'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/components/providers/SettingsProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { getImageUrl } from '@/lib/apiConfig';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Universities', href: '/universities' },
  { name: 'Accommodation', href: '/accommodation' },
  { name: 'Rent & Ride', href: '/#rent-and-ride' },
  { name: 'Resources', href: '/#university-resources' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const settings = useSettings();
  const { user, logout } = useAuth();
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        scrolled
          ? 'navbar-glass shadow-lg py-2.5'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={mobileMenuRef}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="UniEntry GLOBAL"
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-slate-900 font-heading font-bold text-xl leading-none tracking-tight">
                Uni<span className="text-blue-600">Entry</span>
              </span>
              <span className="text-[9px] text-blue-600 font-black uppercase tracking-[0.3em] leading-none mt-1">Global</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-blue-600 bg-blue-50/80'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {/* User profile / logout */}
            {user && (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-xs text-slate-600 font-medium max-w-[80px] truncate">{user.name?.split(' ')[0]}</span>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                  title="Logout"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-slate-900 p-2 rounded-xl hover:bg-blue-50 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              style={{ transform: mobileOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu — CSS transition instead of conditional render */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: mobileOpen ? '500px' : '0px',
            opacity: mobileOpen ? 1 : 0,
            marginTop: mobileOpen ? '1rem' : '0',
            paddingBottom: mobileOpen ? '1rem' : '0',
          }}
        >
          <div className="bg-white/95 backdrop-blur-xl border border-blue-100/50 rounded-2xl p-2 space-y-0.5 shadow-2xl">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-5 py-3.5 rounded-xl text-[15px] font-semibold transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-blue-600 bg-blue-50/80'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 active:bg-blue-100/60'
                }`}
                style={{
                  transitionDelay: mobileOpen ? `${i * 30}ms` : '0ms',
                  transform: mobileOpen ? 'translateX(0)' : 'translateX(-8px)',
                  opacity: mobileOpen ? 1 : 0,
                }}
              >
                {link.name}
              </Link>
            ))}
            {/* Mobile logout */}
            {user && (
              <button
                onClick={logout}
                className="flex items-center gap-3 w-full px-5 py-3.5 rounded-xl text-[15px] font-semibold text-red-500 hover:bg-red-50 active:bg-red-100 transition-all duration-200"
                style={{
                  transitionDelay: mobileOpen ? `${navLinks.length * 30}ms` : '0ms',
                  transform: mobileOpen ? 'translateX(0)' : 'translateX(-8px)',
                  opacity: mobileOpen ? 1 : 0,
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout ({user.name?.split(' ')[0]})
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
