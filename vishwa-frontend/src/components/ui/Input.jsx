export default function Input({ label, icon, className = '', ...props }) {
  return (
    <label className={`grid gap-2 text-sm font-semibold text-slate-300 ${className}`}>
      <span className="flex items-center gap-2">
        {icon && <span className="text-electric">{icon}</span>}
        {label}
      </span>
      <input className="premium-input" {...props} />
    </label>
  );
}

export function Select({ label, icon, options = [], className = '', ...props }) {
  return (
    <label className={`grid gap-2 text-sm font-semibold text-slate-300 ${className}`}>
      <span className="flex items-center gap-2">
        {icon && <span className="text-electric">{icon}</span>}
        {label}
      </span>
      <select className="premium-input" {...props}>
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const text = typeof opt === 'string' ? opt : opt.label;
          return <option key={value} value={value}>{text}</option>;
        })}
      </select>
    </label>
  );
}

export function Textarea({ label, icon, className = '', ...props }) {
  return (
    <label className={`grid gap-2 text-sm font-semibold text-slate-300 ${className}`}>
      <span className="flex items-center gap-2">
        {icon && <span className="text-electric">{icon}</span>}
        {label}
      </span>
      <textarea className="premium-input min-h-[120px] resize-y" {...props} />
    </label>
  );
}
