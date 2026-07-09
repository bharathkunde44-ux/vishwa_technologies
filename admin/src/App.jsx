import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import AdminLayout from './components/AdminLayout';
import AdminLoginPage from './pages/AdminLoginPage';
import ProtectedRoute from './components/ProtectedRoute';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function resolveApiRequest(input) {
  if (!API_BASE_URL || typeof input !== 'string' || !input.startsWith('/api')) {
    return input;
  }
  return `${API_BASE_URL}${input}`;
}

function AdminRoute() {
  const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
  const isAuthenticated = !!token;

  if (isAuthenticated) {
    if (!sessionStorage.getItem('admin_token')) {
      sessionStorage.setItem('admin_token', token);
      sessionStorage.setItem('admin_authenticated', 'true');
      const savedUser = localStorage.getItem('admin_user');
      if (savedUser) {
        sessionStorage.setItem('admin_user', savedUser);
      }
    }
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <AdminLoginPage />;
}

export default function App() {
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Global fetch interceptor to handle auto logout on 401 Unauthorized responses
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      try {
        const request = resolveApiRequest(input);
        const response = await originalFetch(request, init);
        if (response.status === 401) {
          const url = typeof request === 'string' ? request : request?.url || '';
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
      <div className="min-h-screen bg-midnight text-white">
        <div className="noise-overlay fixed inset-0 -z-10 pointer-events-none" />
        <Routes>
          <Route path="/admin" element={<AdminRoute />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
          <Route path="/*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
