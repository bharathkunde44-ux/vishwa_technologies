export default function Badge({ children, icon, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-electric/20 bg-electric/10 px-4 py-2 text-sm font-bold text-electric-300 ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
