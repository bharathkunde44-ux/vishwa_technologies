import { FiMessageCircle } from 'react-icons/fi';

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/919908075796"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3.5 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/30 hover:shadow-xl animate-pulse-glow"
      aria-label="Chat on WhatsApp"
    >
      <FiMessageCircle size={20} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
