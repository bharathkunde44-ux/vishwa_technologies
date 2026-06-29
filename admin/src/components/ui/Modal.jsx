import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

export default function Modal({ open, onClose, title, children, large = false }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-midnight/80 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className={`glass-strong relative z-10 w-full rounded-4xl p-6 md:p-8 ${
              large ? 'max-w-4xl max-h-[85vh]' : 'max-w-2xl max-h-[80vh]'
            } overflow-y-auto`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <header className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <FiX size={18} />
              </button>
            </header>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
