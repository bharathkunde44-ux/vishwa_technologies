import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiShield, FiPhone } from 'react-icons/fi';
import Button from '../ui/Button';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-midnight/90 backdrop-blur-2xl shadow-glass'
          : 'bg-transparent'
      }`}
    >
      <div className="section-container">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/15 bg-navy shadow-glow transition-transform group-hover:scale-105">
              <img src="/logo.jpg" alt="Vishwa Technologies Logo" className="h-full w-full object-cover" />
              <div className="absolute inset-0 rounded-full bg-electric/10 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white font-display">
                VISHWA<span className="text-electric"> TECHNOLOGIES</span>
              </h1>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Security & IT Solutions
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {label}
                {location.pathname === path && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 lg:flex">
            <a
              href="tel:9908075796"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300 transition-all hover:border-electric/30 hover:bg-electric/10 hover:text-white"
            >
              <FiPhone size={14} className="text-electric" />
              <span>+91 99080 75796</span>
            </a>
            <Link to="/booking">
              <Button variant="primary" arrow className="!py-2.5 !px-5 !text-sm">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 text-white lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <nav className="section-container grid gap-1 py-4">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    location.pathname === path
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <a
                href="tel:9908075796"
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
              >
                <FiPhone size={16} className="text-electric" />
                <span>Call: +91 99080 75796</span>
              </a>
              <div className="pt-2">
                <Link to="/booking">
                  <Button variant="primary" arrow className="w-full !text-sm">
                    Book Now
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
