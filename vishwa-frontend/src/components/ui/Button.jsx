import { motion } from 'framer-motion';
import { FiArrowRight, FiLoader } from 'react-icons/fi';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-rose-500 to-rose-700 hover:-translate-y-0.5',
};

export default function Button({
  children,
  variant = 'primary',
  icon,
  arrow = false,
  loading = false,
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${variants[variant]} ${className} ${loading ? 'opacity-70 pointer-events-none' : ''}`}
      disabled={loading}
      {...props}
    >
      {loading && <FiLoader className="animate-spin" size={18} />}
      {!loading && icon}
      {children}
      {arrow && !loading && <FiArrowRight size={18} />}
    </motion.button>
  );
}
