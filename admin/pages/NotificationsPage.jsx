import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiCheckCircle, FiTool, FiAlertTriangle, FiBell, FiCheck } from 'react-icons/fi';

const typeIcons = {
  booking: FiCalendar,
  status: FiCheckCircle,
  service: FiTool,
  system: FiAlertTriangle,
};

const typeColors = {
  booking: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  status: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  service: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  system: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch('/api/admin/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (res.ok) {
        setNotifs(json);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const toggleRead = async (id, isReadNow) => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/notifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_read: !isReadNow })
      });
      if (res.ok) {
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: !isReadNow ? 1 : 0 } : n));
      }
    } catch (err) {
      console.error('Failed to update notification read status:', err.message);
    }
  };

  const markAllRead = async () => {
    const unread = notifs.filter(n => !n.is_read);
    const token = sessionStorage.getItem('admin_token');
    
    // Process marking read concurrently
    try {
      await Promise.all(unread.map(n => 
        fetch(`/api/admin/notifications/${n.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ is_read: true })
        })
      ));
      setNotifs(prev => prev.map(n => ({ ...n, is_read: 1 })));
    } catch (err) {
      console.error('Failed to mark all read:', err.message);
    }
  };

  const unreadCount = notifs.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-electric border-t-transparent mr-3" />
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white font-display">Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 rounded-xl bg-electric/10 px-4 py-2 text-sm font-semibold text-electric border border-electric/20 hover:bg-electric/20 transition-colors"
          >
            <FiCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3 max-w-3xl">
        {notifs.map((notif, i) => {
          const Icon = typeIcons[notif.type] || FiBell;
          const color = typeColors[notif.type] || 'bg-slate-500/15 text-slate-400';
          const isRead = Boolean(notif.is_read);

          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`glass rounded-2xl p-5 flex items-start gap-4 transition-all duration-200 cursor-pointer hover:border-electric/20 ${
                !isRead ? 'border-l-2 border-l-electric bg-electric/5' : 'opacity-70'
              }`}
              onClick={() => toggleRead(notif.id, isRead)}
            >
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${color}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`text-sm font-bold ${!isRead ? 'text-white' : 'text-slate-400'}`}>{notif.title}</h3>
                  {!isRead && <span className="h-2 w-2 rounded-full bg-electric shrink-0 mt-1.5" />}
                </div>
                <p className="mt-1 text-xs text-slate-400 leading-5">{notif.message}</p>
                <p className="mt-2 text-[10px] text-slate-600">
                  {new Date(notif.created_at).toLocaleTimeString()} {new Date(notif.created_at).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          );
        })}
        {notifs.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-10">No notifications found.</p>
        )}
      </div>
    </div>
  );
}
