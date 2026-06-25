import { Link } from 'react-router-dom';
import { FiCamera, FiTool, FiWifi, FiMonitor, FiHardDrive, FiShield, FiDatabase, FiAlertCircle, FiGlobe, FiFileText, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { services } from '../data/services';

const iconMap = { FiCamera, FiTool, FiWifi, FiMonitor, FiHardDrive, FiShield, FiDatabase, FiAlertCircle, FiGlobe, FiFileText };

export default function ServicesPage() {
  return (
    <PageShell
      badge="Our Services"
      title="Comprehensive Security & IT Solutions"
      subtitle="From CCTV installation to enterprise networking — we deliver premium technology solutions tailored to your needs."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => {
          const Icon = iconMap[service.icon] || FiShield;
          return (
            <Card key={service.id} delay={i * 0.06} variant="interactive">
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl gradient-primary shadow-glow">
                <Icon size={26} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">{service.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{service.description}</p>

              {/* Feature Tags */}
              <div className="mt-5 flex flex-wrap gap-2">
                {service.features.map((feat) => (
                  <span key={feat} className="rounded-full bg-electric/10 px-3 py-1 text-xs font-semibold text-electric-300 border border-electric/20">
                    {feat}
                  </span>
                ))}
              </div>

              <Link
                to="/booking"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-electric transition-colors hover:text-electric-300"
              >
                Book This Service <FiArrowRight size={14} />
              </Link>
            </Card>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 glass rounded-4xl px-8 py-12 text-center md:px-16"
      >
        <h2 className="text-2xl font-black text-white font-display md:text-3xl">
          Need a Custom Solution?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          We design tailored security and IT packages based on your specific requirements. Get a free consultation today.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/booking">
            <Button variant="primary" arrow>Get Free Quote</Button>
          </Link>
          <Link to="/contact">
            <Button variant="secondary">Talk to Expert</Button>
          </Link>
        </div>
      </motion.div>
    </PageShell>
  );
}
