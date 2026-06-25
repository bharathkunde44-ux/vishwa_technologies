import { motion } from 'framer-motion';

const cardVariants = {
  default: 'glass-card',
  elevated: 'glass-card shadow-premium',
  interactive: 'glass-card cursor-pointer',
  flat: 'rounded-4xl p-6 bg-surface/50 border border-white/5 transition-all duration-300',
};

export default function Card({
  children,
  variant = 'default',
  className = '',
  delay = 0,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={`${cardVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
