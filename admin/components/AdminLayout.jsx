import { useState, useEffect } from 'react';
import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { FiGrid, FiCalendar, FiUsers, FiTool, FiBarChart2, FiBell, FiSettings, FiLogOut, FiMenu, FiX, FiShield, FiChevronLeft } from 'react-icons/fi';
import DashboardOverview from '../pages/DashboardOverview';
import BookingsPage from '../pages/BookingsPage';
import CustomersPage from '../pages/CustomersPage';
import AdminServicesPage from '../pages/AdminServicesPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import NotificationsPage from '../pages/NotificationsPage';
import SettingsPage from '../pages/SettingsPage';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { path: '/admin/bookings', label: 'Bookings', icon: FiCalendar },
  { path: '/admin/customers', label: 'Customers', icon: FiUsers },
  { path: '/admin/services', label: 'Service Requests', icon: FiTool },
  { path: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
  { path: '/admin/notifications', label: 'Notifications', icon: FiBell },
  { path: '/admin/settings', label: 'Settings', icon: FiSettings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = sessionStorage.getItem('admin_token');
        if (!token) return;
        const res = await fetch('/api/admin/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const json = await res.json();
        if (res.ok) {
          const count = json.filter(n => !n.is_read).length;
          setUnreadCount(count);
        }
      } catch (err) {
        console.error('Failed to load notifications count:', err.message);
      }
    };

    fetchUnreadCount();
    // Poll every 30 seconds for live updates
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex h-screen bg-midnight overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full flex-col border-r border-white/10 bg-navy/95 backdrop-blur-2xl transition-all duration-300 lg:relative lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          {!collapsed && (
            <Link to="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="h-9 w-9 overflow-hidden rounded-full border border-white/15 bg-navy shadow-glow">
                <img src="/logo.jpg" alt="Vishwa Technologies Logo" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-black text-white font-display">VISHWA TECH</p>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Admin Panel</p>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link to="/admin/dashboard" className="mx-auto block h-9 w-9 overflow-hidden rounded-full border border-white/15 bg-navy shadow-glow">
              <img src="/logo.jpg" alt="Vishwa Technologies Logo" className="h-full w-full object-cover" />
            </Link>
          )}
          <button
            className="text-slate-400 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-electric/15 text-electric shadow-glow border border-electric/20'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? label : undefined}
                >
                  <Icon size={18} />
                  {!collapsed && label}
                  {isActive && !collapsed && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-electric" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Collapse Toggle (Desktop) */}
        <div className="hidden lg:block border-t border-white/10 p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <FiChevronLeft size={16} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>

        {/* Bottom — Back to site */}
        <div className="border-t border-white/10 p-3 space-y-1">
          <Link
            to="/"
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-white/5 hover:text-white transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <FiLogOut size={14} />
            {!collapsed && 'Back to Homepage'}
          </Link>
          <button
            onClick={() => {
              sessionStorage.removeItem('admin_authenticated');
              sessionStorage.removeItem('admin_token');
              sessionStorage.removeItem('admin_user');
              localStorage.removeItem('admin_authenticated');
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_user');
              window.location.href = '/admin';
            }}
            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-400 transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <FiLogOut size={16} />
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between border-b border-white/10 bg-navy/50 backdrop-blur-xl px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-400 hover:text-white lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu size={18} />
            </button>
            <div>
              <p className="text-sm font-bold text-white">Welcome back, Admin</p>
              <p className="text-xs text-slate-500">Vishwa Technologies Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/notifications"
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <FiBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-rose-500 text-[10px] font-bold text-white grid place-items-center">
                  {unreadCount}
                </span>
              )}
            </Link>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-electric to-accent text-sm font-bold text-white">
              SN
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          <Routes>
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
