import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingWhatsApp from './components/layout/FloatingWhatsApp';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import ContactPage from './pages/ContactPage';
import CinematicIntro from './components/layout/CinematicIntro';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}


function PublicLayout() {
  return (
    <div className="min-h-screen overflow-hidden bg-midnight text-white">
      <div className="noise-overlay fixed inset-0 -z-10 pointer-events-none" />
      <Navbar />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="booking" element={<BookingPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Routes>
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    // Check if URL contains query parameter ?intro=true to force replay
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('intro') === 'true') {
      return true;
    }
    // Play intro only once per browser session on root homepage path
    const played = sessionStorage.getItem('vishwa_intro_played') === 'true';
    const isRootPath = window.location.pathname === '/';
    return !played && isRootPath;
  });

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('vishwa_intro_played', 'true');
  };

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Global fetch interceptor to handle auto logout on 401 Unauthorized responses
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (response.status === 401) {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
          if (url.includes('/api/admin/') && !url.includes('/api/admin/login')) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_authenticated');
            localStorage.removeItem('admin_user');
            sessionStorage.removeItem('admin_token');
            sessionStorage.removeItem('admin_authenticated');
            sessionStorage.removeItem('admin_user');
            window.location.href = '/admin';
          }
        }
        return response;
      } catch (error) {
        throw error;
      }
    };

    const applyTheme = () => {
      const savedTheme = localStorage.getItem('theme') || 'dark';
      if (savedTheme === 'light') {
        root.classList.add('light');
      } else if (savedTheme === 'dark') {
        root.classList.remove('light');
      } else {
        if (mediaQuery.matches) {
          root.classList.remove('light');
        } else {
          root.classList.add('light');
        }
      }
    };

    applyTheme();

    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        applyTheme();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const handleSystemChange = () => {
      const savedTheme = localStorage.getItem('theme') || 'dark';
      if (savedTheme === 'system') {
        applyTheme();
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
    } else {
      mediaQuery.addListener(handleSystemChange);
    }

    return () => {
      window.fetch = originalFetch;
      window.removeEventListener('storage', handleStorageChange);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemChange);
      } else {
        mediaQuery.removeListener(handleSystemChange);
      }
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="relative">
        <AnimatePresence mode="wait">
          {showIntro && (
            <CinematicIntro key="intro-screen" onComplete={handleIntroComplete} />
          )}
        </AnimatePresence>
        <Routes>

          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
