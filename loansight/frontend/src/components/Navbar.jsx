import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import ApiStatusPill from './ApiStatusPill';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/predict', label: 'Predict' },
  { path: '/about', label: 'About Model' },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="sticky top-0 z-50 pt-4 px-4 sm:px-6 lg:px-8">
      <div
        className={`max-w-7xl mx-auto rounded-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md border-2 border-ink shadow-hard-sm py-2 px-4 sm:px-6'
            : 'bg-white/80 backdrop-blur-md border border-canvas-border shadow-soft py-3 px-4 sm:px-6'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Brand Logo with Custom Editorial SVG Symbol */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-cobalt flex items-center justify-center border-2 border-ink shadow-hard-sm group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" />
                <path d="M12 7v5l3 3" />
                <circle cx="12" cy="12" r="3" fill="#F4E04D" stroke="#101828" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-2xl tracking-tight text-ink leading-none">
                Loan<span className="text-cobalt">Sight</span>
              </span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-ink-muted uppercase -mt-0.5">
                Editorial Risk Engine
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-canvas-subtle p-1.5 rounded-full border border-canvas-border">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-5 py-2 text-xs font-extrabold tracking-wide uppercase transition-colors rounded-full ${
                    isActive ? 'text-ink font-bold' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-highlight-lemon rounded-full border border-ink shadow-hard-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Area: API Status Indicator Pill */}
          <div className="flex items-center gap-3">
            <ApiStatusPill />

            {/* Mobile Hamburger Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-ink hover:bg-canvas-subtle rounded-xl border border-canvas-border transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 bg-white rounded-3xl border-2 border-ink shadow-hard overflow-hidden p-4 space-y-2 z-50"
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-5 py-3 rounded-2xl text-base font-display font-bold transition-all ${
                    isActive
                      ? 'bg-cobalt text-white border-2 border-ink shadow-hard-sm'
                      : 'text-ink hover:bg-canvas-subtle'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

