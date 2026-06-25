import { Link } from 'react-router-dom';
import { FiShield, FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiTwitter, FiLinkedin } from 'react-icons/fi';

const quickLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/services', label: 'Services' },
  { path: '/booking', label: 'Book Service' },
  { path: '/contact', label: 'Contact' },
];

const serviceLinks = [
  'CCTV Installation',
  'CCTV Maintenance',
  'IP Camera Solutions',
  'Networking Solutions',
  'Biometric Systems',
  'AMC Maintenance',
];

const socials = [
  { icon: FiFacebook, href: '#', label: 'Facebook' },
  { icon: FiInstagram, href: '#', label: 'Instagram' },
  { icon: FiTwitter, href: '#', label: 'Twitter' },
  { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-midnight/80">
      {/* Gradient accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric/50 to-transparent" />

      <div className="section-container py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-white/15 bg-navy shadow-glow">
                <img src="/logo.jpg" alt="Vishwa Technologies Logo" className="h-full w-full object-cover" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white font-display">VISHWA TECHNOLOGIES</h3>
              </div>
            </Link>
            <p className="text-sm leading-7 text-slate-400 mb-6">
              Premium CCTV installation, networking, biometric systems, and IT support services since 2012.
              Trusted by corporate, government, and defence clients across Telangana.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all duration-200 hover:border-electric/30 hover:bg-electric/10 hover:text-electric"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-sm text-slate-400 transition-colors hover:text-electric"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-sm text-slate-400 transition-colors hover:text-electric"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <FiPhone size={16} className="mt-0.5 shrink-0 text-electric" />
                <span>+91 99080 75796</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <FiMail size={16} className="mt-0.5 shrink-0 text-electric" />
                <span>vishwatechnologies1510@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <FiMapPin size={16} className="mt-0.5 shrink-0 text-electric" />
                <span>31, Gruhalakshmi Colony, Karkhana, Secunderabad - 500009</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Vishwa Technologies. All rights reserved. Owner: S. Nagaraju
          </p>
          <p className="text-xs text-slate-500">
            Mon - Sat: 9:00 AM - 9:00 PM | Sunday: Closed
          </p>
        </div>
      </div>
    </footer>
  );
}
