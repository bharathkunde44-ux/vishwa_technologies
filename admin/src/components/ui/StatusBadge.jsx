const statusColors = {
  Pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Confirmed: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  'In Progress': 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  Completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Cancelled: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  Active: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Inactive: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  Low: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  Medium: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  High: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  Urgent: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
};

export default function StatusBadge({ status }) {
  const color = statusColors[status] || 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${color}`}>
      {status || '—'}
    </span>
  );
}
