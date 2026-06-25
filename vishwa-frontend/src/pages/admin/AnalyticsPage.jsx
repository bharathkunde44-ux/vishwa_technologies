import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const CHART_COLORS = ['#0fa596', '#10b981', '#34d399', '#f59e0b', '#0d9488', '#0f766e'];

const tooltipStyle = {
  contentStyle: { background: '#0a1f1d', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '12px', color: '#fff', fontSize: '12px' },
};

const formatMonth = (label) => {
  if (!label) return '';
  const parts = label.split('-');
  if (parts.length < 2) return label;
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('default', { month: 'short', year: '2-digit' });
};

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = sessionStorage.getItem('admin_token');
        const res = await fetch('/api/admin/reports', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const json = await res.json();
        if (res.ok) {
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-electric border-t-transparent mr-3" />
        Loading business metrics...
      </div>
    );
  }

  // Parse datasets
  const monthlyBookings = (data?.monthlyBookings || []).map(item => ({
    month: formatMonth(item.label),
    value: item.value
  }));

  const customerGrowth = (data?.customerGrowth || []).map(item => ({
    month: formatMonth(item.label),
    value: item.value
  }));

  const serviceDistribution = (data?.serviceDistribution || []).map(item => ({
    name: item.label,
    value: item.value
  }));

  const weeklyTrends = (data?.weeklyTrends || []).map(item => ({
    day: item.label ? item.label.slice(0, 3) : '',
    bookings: item.value
  }));

  const monthlyReports = (data?.monthlyReports || []).map(item => ({
    month: item.month,
    bookings: item.bookings,
    completed: item.completed,
    pending: item.pending
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white font-display">Analytics & Reports</h1>
        <p className="text-sm text-slate-500 mt-1">Live business performance insights</p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Monthly Bookings - Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-5">
          <h3 className="text-lg font-bold text-white mb-5">Monthly Bookings</h3>
          <div className="h-72">
            {monthlyBookings.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyBookings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="value" fill="#0fa596" radius={[6, 6, 0, 0]} name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-500">No booking metrics yet.</div>
            )}
          </div>
        </motion.div>

        {/* Customer Growth - Line Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-5">
          <h3 className="text-lg font-bold text-white mb-5">Customer Growth (Cumulative)</h3>
          <div className="h-72">
            {customerGrowth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={customerGrowth}>
                  <defs>
                    <linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                  <Tooltip {...tooltipStyle} formatter={(v) => [v, 'Customers']} />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} fill="url(#custGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-500">No customer growth metrics yet.</div>
            )}
          </div>
        </motion.div>

        {/* Service Distribution - Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-5">
          <h3 className="text-lg font-bold text-white mb-5">Service Distribution</h3>
          <div className="h-72">
            {serviceDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={serviceDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: '#64748b' }} fontSize={9}>
                    {serviceDistribution.map((entry, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-500">No bookings service type data yet.</div>
            )}
          </div>
        </motion.div>

        {/* Weekly Trends */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-2xl p-5">
          <h3 className="text-lg font-bold text-white mb-5">Weekly Trends</h3>
          <div className="h-72">
            {weeklyTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="bookings" fill="#10b981" radius={[4, 4, 0, 0]} name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-500">No weekday distribution data yet.</div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Monthly Reports Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass rounded-2xl p-5">
        <h3 className="text-lg font-bold text-white mb-5">Monthly Reports</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="pb-3 pr-4">Month</th>
                <th className="pb-3 pr-4">Bookings</th>
                <th className="pb-3 pr-4">Completed</th>
                <th className="pb-3">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {monthlyReports.map((r, i) => (
                <tr key={r.month || i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4 font-medium text-white">{r.month}</td>
                  <td className="py-3 pr-4">{r.bookings}</td>
                  <td className="py-3 pr-4 text-emerald-400">{r.completed}</td>
                  <td className="py-3 text-amber-400">{r.pending}</td>
                </tr>
              ))}
              {monthlyReports.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-5 text-center text-slate-500">No monthly trends data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
