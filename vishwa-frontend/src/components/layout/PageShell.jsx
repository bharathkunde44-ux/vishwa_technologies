import { motion } from 'framer-motion';
import { FiShield } from 'react-icons/fi';
import Badge from '../ui/Badge';

export default function PageShell({ badge, title, subtitle, children }) {
  return (
    <main className="section-container py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-12 max-w-4xl"
      >
        {badge && (
          <Badge icon={<FiShield size={14} />} className="mb-5">
            {badge}
          </Badge>
        )}
        <h1 className="text-4xl font-black leading-tight tracking-tight text-white font-display md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 text-lg leading-8 text-slate-400">{subtitle}</p>
        )}
      </motion.div>
      <div className="space-y-8">{children}</div>
    </main>
  );
}
