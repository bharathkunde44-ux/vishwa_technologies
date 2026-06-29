import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiSave, FiBell, FiMoon, FiMonitor, FiSun } from 'react-icons/fi';
import Button from '../../components/ui/Button';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    username: 'admin',
    email: 'vishwatechnologies1510@gmail.com'
  });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [saved, setSaved] = useState('');
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [notifSettings, setNotifSettings] = useState({
    newBooking: true,
    serviceComplete: true,
    payments: true,
    systemAlerts: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('admin_token');
        const res = await fetch('/api/admin/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok && data.admin) {
          setProfile({
            username: data.admin.username,
            email: data.admin.email
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err.message);
      }
    };
    fetchProfile();
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    const root = document.documentElement;
    if (newTheme === 'light') {
      root.classList.add('light');
    } else if (newTheme === 'dark') {
      root.classList.remove('light');
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        root.classList.remove('light');
      } else {
        root.classList.add('light');
      }
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaved('');

    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: profile.username,
          email: profile.email
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile.');
      }
      setSaved('Profile updated successfully!');
      setTimeout(() => setSaved(''), 3000);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaved('');

    if (passwords.newPass !== passwords.confirm) {
      setError('New password and confirm password do not match.');
      return;
    }

    if (passwords.newPass.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch('/api/admin/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.newPass
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update password.');
      }
      setSaved('Password changed successfully!');
      setPasswords({ current: '', newPass: '', confirm: '' });
      setTimeout(() => setSaved(''), 3000);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-white font-display">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account and preferences</p>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-400"
        >
          {saved}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-semibold text-rose-400"
        >
          {error}
        </motion.div>
      )}

      {/* Profile Settings */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleProfileSave}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <FiUser size={18} className="text-electric" /> Profile Settings
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-slate-300">
            <span className="flex items-center gap-2"><FiUser size={14} className="text-electric" /> Username</span>
            <input className="premium-input" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-300">
            <span className="flex items-center gap-2"><FiMail size={14} className="text-electric" /> Email</span>
            <input className="premium-input" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          </label>
        </div>
        <div className="mt-5">
          <Button type="submit" variant="primary" icon={<FiSave size={16} />}>Save Profile</Button>
        </div>
      </motion.form>

      {/* Password Change */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handlePasswordSave}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <FiLock size={18} className="text-electric" /> Change Password
        </h3>
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-slate-300">
            Current Password
            <input className="premium-input" type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-300">
              New Password
              <input className="premium-input" type="password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-300">
              Confirm Password
              <input className="premium-input" type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
            </label>
          </div>
        </div>
        <div className="mt-5">
          <Button type="submit" variant="primary" icon={<FiLock size={16} />}>Change Password</Button>
        </div>
      </motion.form>

      {/* Notification Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <FiBell size={18} className="text-electric" /> Notification Preferences
        </h3>
        <div className="space-y-4">
          {[
            ['newBooking', 'New Booking Alerts', 'Get notified when a new booking is received'],
            ['serviceComplete', 'Service Completion', 'Get notified when a service is marked complete'],
            ['payments', 'Payment Notifications', 'Get notified for payment events'],
            ['systemAlerts', 'System Alerts', 'Receive system maintenance and update notifications'],
          ].map(([key, title, desc]) => (
            <div key={key} className="flex items-center justify-between rounded-xl bg-white/5 p-4 border border-white/5">
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => setNotifSettings({ ...notifSettings, [key]: !notifSettings[key] })}
                className={`relative h-7 w-12 rounded-full transition-colors duration-200 ${
                  notifSettings[key] ? 'bg-electric' : 'bg-white/10'
                }`}
              >
                <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${
                  notifSettings[key] ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Theme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <FiMoon size={18} className="text-electric" /> Appearance
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['dark', 'Dark Mode', FiMoon],
            ['light', 'Light Mode', FiSun],
            ['system', 'System', FiMonitor],
          ].map(([key, label, Icon]) => {
            const active = theme === key;
            return (
              <button
                key={key}
                onClick={() => handleThemeChange(key)}
                className={`flex items-center gap-3 rounded-xl p-4 border transition-all ${
                  active ? 'bg-electric/10 border-electric/30 text-electric' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-semibold">{label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
