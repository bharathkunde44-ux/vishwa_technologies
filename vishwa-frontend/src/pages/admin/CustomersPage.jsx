import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiEye, FiChevronLeft, FiChevronRight, FiCalendar, FiTool, FiMessageSquare } from 'react-icons/fi';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [customersList, setCustomersList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'services' | 'contacts'

  const perPage = 8;

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('admin_token');
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`/api/admin/customers?page=${page}&limit=${perPage}${searchParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setCustomersList(json.data);
        setTotalPages(json.meta.totalPages || 1);
        setTotalItems(json.meta.total || 0);
      }
    } catch (err) {
      console.error('Failed to load customers:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchCustomers, search ? 300 : 0);
    return () => clearTimeout(delay);
  }, [search, page]);

  const handleSelectCustomer = async (customer) => {
    setSelected(customer);
    setDetailsLoading(true);
    setSelectedDetails(null);
    setActiveTab('bookings');
    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/customers/${encodeURIComponent(customer.email)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (res.ok) {
        setSelectedDetails(json);
      }
    } catch (err) {
      console.error('Failed to load customer details:', err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white font-display">Customer Management</h1>
        <p className="text-sm text-slate-500 mt-1">{totalItems} customers in system</p>
      </div>

      <label className="relative max-w-md block">
        <FiSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          className="premium-input !pl-10 !py-2.5 !text-sm"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </label>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex py-20 items-center justify-center text-slate-500">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-electric border-t-transparent mr-3" />
              Loading customers...
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Address</th>
                  <th className="px-5 py-3 text-center">Bookings</th>
                  <th className="px-5 py-3">Last Activity</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customersList.map((c, i) => (
                  <tr key={c.email || i} className="text-slate-300 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 font-medium text-white whitespace-nowrap">{c.name || 'Unnamed'}</td>
                    <td className="px-5 py-3 text-slate-400">{c.email}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{c.phone || 'N/A'}</td>
                    <td className="px-5 py-3 text-slate-400 max-w-[200px] truncate">{c.address || 'No address'}</td>
                    <td className="px-5 py-3 text-center font-semibold text-white">{c.total_bookings}</td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                      {c.last_activity ? new Date(c.last_activity).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => handleSelectCustomer(c)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors" title="View details">
                        <FiEye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {customersList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-slate-500">No customers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-between border-t border-white/10 px-5 py-3">
            <p className="text-xs text-slate-500">Page {page} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(page - 1)} disabled={page === 1} className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-slate-400 disabled:opacity-30"><FiChevronLeft size={14} /></button>
              <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-slate-400 disabled:opacity-30"><FiChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </motion.div>

      <Modal open={!!selected} onClose={() => { setSelected(null); setSelectedDetails(null); }} title="Customer Profile Details">
        {selected && (
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
            {/* General Info Card */}
            <div className="glass p-4 rounded-xl space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Customer Information</h3>
              <div className="grid gap-2 sm:grid-cols-2 text-sm">
                <div><span className="text-slate-500 text-xs">Name:</span> <p className="text-white font-medium">{selected.name || 'Unnamed'}</p></div>
                <div><span className="text-slate-500 text-xs">Email:</span> <p className="text-white font-medium">{selected.email}</p></div>
                <div><span className="text-slate-500 text-xs">Phone:</span> <p className="text-white font-medium">{selected.phone || 'N/A'}</p></div>
                <div><span className="text-slate-500 text-xs">Address:</span> <p className="text-white font-medium">{selected.address || 'N/A'}</p></div>
              </div>
            </div>

            {/* Tab Selection */}
            <div className="flex border-b border-white/10 gap-2">
              {[
                { id: 'bookings', label: 'Bookings', icon: FiCalendar },
                { id: 'services', label: 'Service Requests', icon: FiTool },
                { id: 'contacts', label: 'Messages', icon: FiMessageSquare },
              ].map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-all ${
                      active ? 'border-electric text-electric bg-electric/5' : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon size={13} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            {detailsLoading ? (
              <div className="flex py-10 items-center justify-center text-slate-500 text-xs">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-electric border-t-transparent mr-2" />
                Fetching customer logs...
              </div>
            ) : selectedDetails ? (
              <div className="space-y-3">
                {activeTab === 'bookings' && (
                  <div className="overflow-hidden rounded-xl border border-white/5 bg-white/5">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                          <th className="p-3">Service Type</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300">
                        {(selectedDetails.bookings || []).map(b => (
                          <tr key={b.id}>
                            <td className="p-3 font-medium text-white">{b.service_type}</td>
                            <td className="p-3">{new Date(b.preferred_date).toLocaleDateString()}</td>
                            <td className="p-3"><StatusBadge status={b.status} /></td>
                          </tr>
                        ))}
                        {(selectedDetails.bookings || []).length === 0 && (
                          <tr><td colSpan={3} className="p-4 text-center text-slate-500">No bookings found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'services' && (
                  <div className="overflow-hidden rounded-xl border border-white/5 bg-white/5">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                          <th className="p-3">Issue</th>
                          <th className="p-3">Visit Date</th>
                          <th className="p-3">Priority</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300">
                        {(selectedDetails.services || []).map(s => (
                          <tr key={s.id}>
                            <td className="p-3 truncate max-w-[150px]" title={s.issue_description}>{s.issue_description}</td>
                            <td className="p-3">{new Date(s.preferred_visit_date).toLocaleDateString()}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                s.priority === 'Urgent' ? 'bg-red-500/20 text-red-400' :
                                s.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                s.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
                              }`}>{s.priority}</span>
                            </td>
                            <td className="p-3"><StatusBadge status={s.status} /></td>
                          </tr>
                        ))}
                        {(selectedDetails.services || []).length === 0 && (
                          <tr><td colSpan={4} className="p-4 text-center text-slate-500">No service requests found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'contacts' && (
                  <div className="space-y-2">
                    {(selectedDetails.contacts || []).map(c => (
                      <div key={c.id} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-electric uppercase">{c.service_type || 'General Inquiry'}</span>
                          <span className="text-[10px] text-slate-500">{new Date(c.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs font-semibold text-white">{c.message}</p>
                      </div>
                    ))}
                    {(selectedDetails.contacts || []).length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-4">No contact messages received.</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-500">Failed to load customer profile records.</div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
