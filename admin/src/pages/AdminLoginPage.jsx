import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import Button from '../components/ui/Button';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
      if (!token) {
        setChecking(false);
        return;
      }
      try {
        const res = await fetch('/api/admin/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          // Sync to sessionStorage
          if (!sessionStorage.getItem('admin_token')) {
            sessionStorage.setItem('admin_token', token);
            sessionStorage.setItem('admin_authenticated', 'true');
            const savedUser = localStorage.getItem('admin_user');
            if (savedUser) {
              sessionStorage.setItem('admin_user', savedUser);
            }
          }
          navigate('/admin/dashboard', { replace: true });
        } else {
          // Token invalid/expired
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_authenticated');
          localStorage.removeItem('admin_user');
          sessionStorage.removeItem('admin_token');
          sessionStorage.removeItem('admin_authenticated');
          sessionStorage.removeItem('admin_user');
          setChecking(false);
        }
      } catch (err) {
        // Fallback on network error
        if (!sessionStorage.getItem('admin_token')) {
          sessionStorage.setItem('admin_token', token);
          sessionStorage.setItem('admin_authenticated', 'true');
        }
        navigate('/admin/dashboard', { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get('content-type');
      let data = {};
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        throw new Error(`Server connection failed (HTTP ${res.status}). Please check if the backend is running.`);
      }

      if (!res.ok) {
        throw new Error(data.message || 'Invalid admin credentials');
      }

      if (rememberMe) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
      } else {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_authenticated');
        localStorage.removeItem('admin_user');
      }

      sessionStorage.setItem('admin_token', data.token);
      sessionStorage.setItem('admin_authenticated', 'true');
      sessionStorage.setItem('admin_user', JSON.stringify(data.admin));
      
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-midnight px-4 py-12 text-white">
        <div className="absolute inset-0 noise-overlay opacity-80" />
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-electric border-t-transparent mx-auto mb-4" />
          <p className="text-slate-400 text-sm font-semibold">Verifying secure portal session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-midnight px-4 py-12 text-white">
      {/* Background radial effects */}
      <div className="absolute inset-0 noise-overlay opacity-80" />
      <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-electric/5 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back Link */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <FiArrowLeft size={16} /> Back to Homepage
        </Link>

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border border-white/20 bg-navy shadow-glow flex items-center justify-center">
            <img src="/logo.jpg" alt="Vishwa Technologies Logo" className="h-full w-full object-cover" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white font-display">
            Admin Portal
          </h1>
          <p className="mt-1.5 text-sm text-slate-400 font-semibold uppercase tracking-wider">
            Vishwa Technologies
          </p>
        </div>

        {/* Form Card */}
        <div className="glass rounded-3xl p-6 md:p-8 border border-white/10 shadow-glass">
          <h2 className="text-lg font-bold text-white mb-6">Login Authentication</h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-semibold text-rose-400"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <label className="grid gap-2 text-sm font-semibold text-slate-300">
              <span className="flex items-center gap-2">
                <FiMail size={14} className="text-electric" /> Email Address
              </span>
              <input
                type="email"
                className="premium-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vishwatechnologies1510@gmail.com"
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-300">
              <span className="flex items-center gap-2">
                <FiLock size={14} className="text-electric" /> Password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="premium-input pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/10 bg-surface/70 accent-electric cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember Me</span>
              </label>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full justify-center"
              >
                Sign In to Dashboard
              </Button>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Authorized personnel access only. Actions logged.
        </p>
      </motion.div>
    </div>
  );
}
