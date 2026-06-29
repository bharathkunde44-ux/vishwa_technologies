import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiEye, FiTrash2, FiChevronLeft, FiChevronRight, FiImage } from 'react-icons/fi';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';

const statuses = ['All', 'Pending', 'Assigned', 'In Progress', 'Completed'];
const priorities = ['All', 'Low', 'Medium', 'High', 'Urgent'];

export default function AdminServicesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [requestsList, setRequestsList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const perPage = 8;

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('admin_token');
      const statusParam = statusFilter === 'All' ? '' : `&status=${statusFilter}`;
      const priorityParam = priorityFilter === 'All' ? '' : `&priority=${priorityFilter}`;
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`/api/admin/services?page=${page}&limit=${perPage}${statusParam}${priorityParam}${searchParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setRequestsList(json.data);
        setTotalPages(json.meta.totalPages || 1);
        setTotalItems(json.meta.total || 0);
      }
    } catch (err) {
      console.error('Failed to load maintenance requests:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchRequests, search ? 300 : 0);
    return () => clearTimeout(delay);
  }, [search, statusFilter, priorityFilter, page]);

  const handleUpdate = async (requestId, updates) => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/services/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        fetchRequests();
        if (selected && selected.id === requestId) {
          setSelected({ ...selected, ...updates });
        }
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to update request.');
      }
    } catch (err) {
      console.error('Failed to update request:', err.message);
      alert('Error updating request status/priority.');
    }
  };

  const executeDelete = async (requestId) => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/services/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchRequests();
        if (selected && selected.id === requestId) {
          setSelected(null);
        }
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete request.');
      }
    } catch (err) {
      console.error('Failed to delete request:', err.message);
      alert('Error: Network or server issue. Failed to delete request.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white font-display">Service & Maintenance Requests</h1>
        <p className="text-sm text-slate-500 mt-1">{totalItems} service requests found</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1 max-w-md">
            <FiSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="premium-input !pl-10 !py-2.5 !text-sm"
              placeholder="Search requests..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </label>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 flex-wrap text-slate-400 text-xs">
          <span className="font-semibold text-slate-500">Status:</span>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                statusFilter === s
                  ? 'bg-electric/20 text-electric border border-electric/30'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Priority Filters */}
        <div className="flex items-center gap-2 flex-wrap text-slate-400 text-xs">
          <span className="font-semibold text-slate-500">Priority:</span>
          {priorities.map((p) => (
            <button
              key={p}
              onClick={() => { setPriorityFilter(p); setPage(1); }}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                priorityFilter === p
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex py-20 items-center justify-center text-slate-500">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-electric border-t-transparent mr-3" />
              Loading requests...
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Issue Description</th>
                  <th className="px-5 py-3">Preferred Date</th>
                  <th className="px-5 py-3 text-center">Reference</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {requestsList.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 font-medium text-white whitespace-nowrap">{r.name}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{r.phone}</td>
                    <td className="px-5 py-3 max-w-[200px] truncate text-slate-400" title={r.issue_description}>
                      {r.issue_description}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-slate-400">
                      {new Date(r.preferred_visit_date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {r.issue_image ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-electric/15 text-electric-300 px-2 py-0.5 rounded border border-electric/25">
                          <FiImage size={10} /> Image
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.priority === 'Urgent' ? 'bg-red-500/20 text-red-400' :
                        r.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        r.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
                      }`}>{r.priority}</span>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(r)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors" title="View Details"><FiEye size={14} /></button>
                        <button onClick={() => setDeleteConfirmId(r.id)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition-colors" title="Delete"><FiTrash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {requestsList.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-slate-500">No requests found.</td>
                  </tr>
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
              <button onClick={() => setPage(page - 1)} disabled={page === 1} className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-slate-400 disabled:opacity-30"><FiChevronLeft size={14} /></button>
              <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-slate-400 disabled:opacity-30"><FiChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Details Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Service Request Details">
        {selected && (
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Customer', selected.name],
                ['Phone', selected.phone],
                ['Email', selected.email],
                ['Preferred Date', new Date(selected.preferred_visit_date).toLocaleDateString()],
              ].map(([l, v]) => (
                <div key={l} className="flex flex-col rounded-xl bg-white/5 p-3 border border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{l}</span>
                  <span className="text-sm font-semibold text-white mt-0.5">{v}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col rounded-xl bg-white/5 p-3 border border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Issue Description</span>
              <p className="text-sm text-slate-200 mt-1 whitespace-pre-wrap">{selected.issue_description}</p>
            </div>

            {selected.message && (
              <div className="flex flex-col rounded-xl bg-white/5 p-3 border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Additional Message</span>
                <p className="text-sm text-slate-200 mt-1 whitespace-pre-wrap">{selected.message}</p>
              </div>
            )}

            {/* Reference Image */}
            {selected.issue_image && (
              <div className="flex flex-col rounded-xl bg-white/5 p-3 border border-white/5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Reference Image</span>
                <div className="rounded-xl overflow-hidden border border-white/10 max-h-60 max-w-full overflow-hidden flex justify-center items-center bg-black/30">
                  <img src={selected.issue_image} alt="Maintenance issue upload" className="max-h-60 object-contain w-auto h-auto" />
                </div>
              </div>
            )}

            {/* Actions Section */}
            <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-white/15">
              {/* Priority Select */}
              <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                Update Priority
                <select
                  className="premium-input !py-2 !text-sm"
                  value={selected.priority}
                  onChange={(e) => handleUpdate(selected.id, { priority: e.target.value })}
                >
                  {['Low', 'Medium', 'High', 'Urgent'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>

              {/* Status Select */}
              <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                Update Status
                <select
                  className="premium-input !py-2 !text-sm"
                  value={selected.status}
                  onChange={(e) => handleUpdate(selected.id, { status: e.target.value })}
                >
                  {['Pending', 'Assigned', 'In Progress', 'Completed'].map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Confirm Deletion">
        <div className="space-y-4">
          <p className="text-sm text-slate-300">Are you sure you want to permanently delete this service request? This action cannot be undone.</p>
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
                executeDelete(id);
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
