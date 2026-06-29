import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiCheckCircle, FiTrendingUp, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatusBadge from '../../components/ui/StatusBadge';

const formatMonth = (label) => {
  if (!label) return '';
  const parts = label.split('-');
  if (parts.length < 2) return label;
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('default', { month: 'short', year: '2-digit' });
};

export default function DashboardOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = sessionStorage.getItem('admin_token');
        const res = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const json = await res.json();
        if (res.ok) {
          setData(json);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-electric border-t-transparent mr-3" />
        Loading dashboard metrics...
      </div>
    );
  }

  const stats = data?.stats || {
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalCustomers: 0
  };

  const recent = (data?.recentBookings || []).map(b => ({
    id: b.id,
    customer: b.full_name,
    service: b.service_type,
    date: new Date(b.preferred_date).toLocaleDateString(),
    status: b.status
  }));

  const statCards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: FiCalendar, trend: '+12%', up: true, color: 'from-teal-500 to-teal-700' },
    { label: 'Pending Requests', value: stats.pendingBookings, icon: FiClock, trend: '-5%', up: false, color: 'from-amber-500 to-amber-700' },
    { label: 'Completed Services', value: stats.completedBookings, icon: FiCheckCircle, trend: '+18%', up: true, color: 'from-emerald-500 to-emerald-700' },
  ];

  // Map timeline
  const timeline = (data?.timeline || []).map((t, idx) => ({
    id: idx,
    type: t.type || 'booking',
    title: t.title,
    description: t.message,
    time: new Date(t.created_at).toLocaleTimeString() + ' ' + new Date(t.created_at).toLocaleDateString()
  }));

  // Map monthly booking trends for Recharts
  const monthlyBookingsTrend = (data?.monthlyTrends || []).map(m => ({
    month: formatMonth(m.month),
    bookings: m.bookings
  }));

  // Fallback monthly data if empty
  if (monthlyBookingsTrend.length === 0) {
    monthlyBookingsTrend.push({ month: formatMonth(new Date().toISOString().slice(0, 7)), bookings: stats.totalBookings });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white font-display">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-5 group hover:border-electric/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${card.color} shadow-lg`}>
                  <Icon size={20} className="text-white" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-bold ${card.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {card.up ? <FiArrowUpRight size={12} /> : <FiArrowDownRight size={12} />}
                  {card.trend}
                </span>
              </div>
              <p className="mt-4 text-2xl font-black text-white font-display">{card.value}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts + Activity */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        {/* Bookings Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Bookings Overview</h3>
              <p className="text-xs text-slate-500 mt-0.5">Monthly bookings volume</p>
            </div>
            <FiTrendingUp size={20} className="text-electric" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyBookingsTrend}>
                <defs>
                  <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0fa596" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0fa596" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#0a1f1d', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '12px', color: '#fff' }}
                  formatter={(value) => [value, 'Bookings']}
                />
                <Area type="monotone" dataKey="bookings" stroke="#0fa596" strokeWidth={2.5} fill="url(#bookingsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-5"
        >
          <h3 className="text-lg font-bold text-white mb-5">Recent Activity</h3>
          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
            {timeline.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  item.type === 'booking' ? 'bg-teal-400' :
                  item.type === 'completed' ? 'bg-emerald-400' :
                  item.type === 'payment' ? 'bg-emerald-500' : 'bg-amber-400'
                }`} />
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-5">{item.description}</p>
                  <p className="text-[10px] text-slate-600 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
            {timeline.length === 0 && (
              <p className="text-xs text-slate-500">No recent activity found.</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-5"
      >
        <h3 className="text-lg font-bold text-white mb-5">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Service</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recent.map((booking) => (
                <tr key={booking.id} className="text-slate-300 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4 font-medium text-white">{booking.customer}</td>
                  <td className="py-3 pr-4">{booking.service}</td>
                  <td className="py-3 pr-4 text-slate-400">{booking.date}</td>
                  <td className="py-3"><StatusBadge status={booking.status} /></td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-5 text-center text-slate-500">No recent bookings.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
