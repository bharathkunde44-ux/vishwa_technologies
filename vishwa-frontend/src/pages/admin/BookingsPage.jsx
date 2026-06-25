import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiEye, FiTrash2, FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';

const statuses = ['All', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

export default function BookingsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [bookingsList, setBookingsList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const perPage = 8;

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('admin_token');
      const statusParam = statusFilter === 'All' ? '' : `&status=${statusFilter}`;
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`/api/admin/bookings?page=${page}&limit=${perPage}${statusParam}${searchParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setBookingsList(json.data.map(b => ({
          id: b.id,
          customer: b.full_name,
          phone: b.phone,
          email: b.email,
          service: b.service_type,
          location: b.service_address,
          date: new Date(b.preferred_date).toLocaleDateString(),
          status: b.status,
          message: b.message || 'No message'
        })));
        setTotalPages(json.meta.totalPages || 1);
        setTotalItems(json.meta.total || 0);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchBookings, search ? 300 : 0);
    return () => clearTimeout(delay);
  }, [search, statusFilter, page]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchBookings();
        setSelected(null);
      }
    } catch (err) {
      console.error('Failed to update status:', err.message);
    }
  };

  const executeDeleteBooking = async (bookingId) => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchBookings();
      } else {
        const json = await res.json();
        alert(json.message || 'Failed to delete booking.');
      }
    } catch (err) {
      console.error('Failed to delete booking:', err.message);
      alert('Error: Network or server issue. Failed to delete booking.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white font-display">Booking Management</h1>
        <p className="text-sm text-slate-500 mt-1">{totalItems} bookings found</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1 max-w-md">
          <FiSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="premium-input !pl-10 !py-2.5 !text-sm"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          <FiFilter size={14} className="text-slate-500" />
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                statusFilter === s
                  ? 'bg-electric/20 text-electric border border-electric/30'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex py-20 items-center justify-center text-slate-500">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-electric border-t-transparent mr-3" />
              Loading bookings...
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookingsList.map((b) => (
                  <tr key={b.id} className="text-slate-300 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 font-medium text-white whitespace-nowrap">{b.customer}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{b.phone}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{b.service}</td>
                    <td className="px-5 py-3 text-slate-400 max-w-[200px] truncate">{b.location}</td>
                    <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{b.date}</td>
                    <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(b)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors" title="View"><FiEye size={14} /></button>
                        <button onClick={() => setDeleteConfirmId(b.id)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition-colors" title="Delete"><FiTrash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bookingsList.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-500">No bookings found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-between border-t border-white/10 px-5 py-3">
            <p className="text-xs text-slate-500">
              Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, totalItems)} of {totalItems}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <FiChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`grid h-8 w-8 place-items-center rounded-lg text-xs font-bold transition-colors ${
                    p === page ? 'bg-electric/20 text-electric border border-electric/30' : 'text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Booking Details">
        {selected && (
          <div className="space-y-4">
            {[
              ['Customer', selected.customer],
              ['Phone', selected.phone],
              ['Email', selected.email],
              ['Service', selected.service],
              ['Location', selected.location],
              ['Date', selected.date],
              ['Message', selected.message],
            ].map(([label, val]) => (
              <div key={label} className="flex items-start gap-3 rounded-xl bg-white/5 p-3 border border-white/5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
                  <p className="text-sm text-white mt-0.5">{val}</p>
                </div>
              </div>
            ))}
            
            {/* Status Update Select */}
            <div className="rounded-xl bg-white/5 p-3 border border-white/5 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Update Booking Status</label>
              <select
                className="premium-input !py-2 !text-sm"
                value={selected.status}
                onChange={(e) => handleUpdateStatus(selected.id, e.target.value)}
              >
                {['Pending', 'Confirmed', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'].map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Confirm Deletion">
        <div className="space-y-4">
          <p className="text-sm text-slate-300">Are you sure you want to permanently delete this booking? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const id = deleteConfirmId;
                setDeleteConfirmId(null);
                executeDeleteBooking(id);
              }}
              className="px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-400 hover:bg-rose-500/30 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
