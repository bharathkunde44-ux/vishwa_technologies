import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiShield, FiCamera, FiArrowRight, FiCheck, FiChevronDown, FiChevronUp, FiUsers, FiHeadphones, FiAward, FiDollarSign, FiActivity, FiMonitor, FiTool, FiStar, FiPhone } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { services } from '../data/services';
import { testimonials } from '../data/testimonials';
import { companyStats, whyChooseUs } from '../data/stats';
import { faqItems } from '../data/faq';
import { projects } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

/* ============================================
   HERO SECTION
   ============================================ */
function HeroSection() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const words = ['Homes', 'Offices', 'Warehouses', 'Institutions'];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden flex items-center">


      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-navy to-midnight" />
      <div className="absolute inset-0 noise-overlay" />

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(56,189,248,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-[10%] h-72 w-72 rounded-full bg-electric/10 blur-[100px] animate-float" />
      <div className="absolute bottom-20 right-[10%] h-96 w-96 rounded-full bg-accent/10 blur-[120px] animate-float-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-electric/5 blur-[150px]" />

      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="section-container relative z-10 py-20">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Badge icon={<FiShield size={14} />} className="mb-6">
              Premium Security & IT Solutions Since 2012
            </Badge>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white font-display md:text-6xl lg:text-7xl">
              Secure Your{' '}
              <span className="relative inline-block">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="gradient-text-electric"
                >
                  {words[wordIndex]}
                </motion.span>
              </span>
              <br />
              With Expert Technology
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
              Professional CCTV installation, networking, biometric systems, and comprehensive IT support.
              Trusted by corporate, government, and defence clients across Telangana.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/booking">
                <Button variant="primary" arrow>Book Installation</Button>
              </Link>
              <Link to="/services">
                <Button variant="secondary">Explore Services</Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-2"><FiCheck className="text-emerald-400" /> 2000+ Projects</span>
              <span className="flex items-center gap-2"><FiCheck className="text-emerald-400" /> 12+ Years</span>
              <span className="flex items-center gap-2"><FiCheck className="text-emerald-400" /> Govt. Approved</span>
            </div>
          </motion.div>

          {/* Right - Security Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="glass rounded-4xl p-5 animate-float">
              <div className="rounded-3xl border border-electric/10 bg-surface/80 p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live Security</p>
                    <h3 className="text-xl font-bold text-white">All Zones Protected</h3>
                  </div>
                  <FiActivity className="text-electric" size={24} />
                </div>
                <div className="space-y-3">
                  {['Front Gate', 'Parking Area', 'Office Entry', 'Server Room'].map((zone, i) => (
                    <div key={zone} className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
                      <span className="flex items-center gap-3 text-sm font-medium">
                        <FiCamera size={16} className="text-electric" />
                        {zone}
                      </span>
                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Online
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[['98.5%', 'Uptime'], ['24/7', 'Monitor'], ['< 2hr', 'Response']].map(([val, label]) => (
                    <div key={label} className="rounded-xl bg-electric/5 p-3 text-center">
                      <p className="text-lg font-bold text-electric">{val}</p>
                      <p className="text-[10px] font-semibold uppercase text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-xs font-semibold uppercase tracking-wider">Scroll</span>
        <FiChevronDown size={16} />
      </motion.div>
    </section>
  );
}

/* ============================================
   SERVICES PREVIEW
   ============================================ */
function ServicesPreview() {
  const icons = { FiCamera, FiTool, FiMonitor, FiShield };
  const featured = services.slice(0, 4);

  return (
    <section className="section-container section-padding">
      <SectionHeader badge="Our Services" title="Enterprise-Grade Security Solutions" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {featured.map((service, i) => (
          <Card key={service.id} delay={i * 0.08} variant="interactive">
            <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl gradient-primary shadow-glow">
              <FiCamera size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">{service.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{service.description.slice(0, 100)}...</p>
            <Link to="/services" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-electric transition-colors hover:text-electric-300">
              Learn More <FiArrowRight size={14} />
            </Link>
          </Card>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link to="/services">
          <Button variant="secondary" arrow>View All Services</Button>
        </Link>
      </div>
    </section>
  );
}

/* ============================================
   WHY CHOOSE US
   ============================================ */
function WhyChooseUsSection() {
  const iconMap = { FiUsers, FiHeadphones, FiAward, FiDollarSign };

  return (
    <section className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" />
      <div className="section-container relative z-10">
        <SectionHeader badge="Why Choose Us" title="Trusted by Businesses Across Telangana" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item, i) => {
            const Icon = iconMap[item.icon] || FiShield;
            return (
              <Card key={item.title} delay={i * 0.1}>
                <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-electric/20 bg-electric/10">
                  <Icon size={24} className="text-electric" />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   STATS COUNTER
   ============================================ */
function StatsSection() {
  const statsRef = useRef(null);
  const [counts, setCounts] = useState(companyStats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!statsRef.current || hasAnimated) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          companyStats.forEach((stat, i) => {
            const target = stat.value;
            const duration = 2000;
            const start = performance.now();
            const animate = (now) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setCounts((prev) => {
                const next = [...prev];
                next[i] = Math.round(eased * target);
                return next;
              });
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={statsRef} className="section-container py-16">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {companyStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-4xl p-8 text-center"
          >
            <strong className="block text-5xl font-black gradient-text-electric font-display">
              {counts[i].toLocaleString()}{stat.suffix}
            </strong>
            <span className="mt-3 block text-sm font-semibold text-slate-400">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ============================================
   PROJECT SHOWCASE
   ============================================ */
function ProjectShowcase() {
  return (
    <section className="section-padding">
      <div className="section-container">
        <SectionHeader badge="Our Projects" title="Featured Installations" />
      </div>
      <div className="section-container">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-14"
        >
          {projects.map((project) => (
            <SwiperSlide key={project.id}>
              <div className="glass rounded-4xl overflow-hidden group">
                <div className="h-48 relative overflow-hidden flex items-center justify-center bg-navy">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <FiCamera size={48} className="text-electric/40" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                  <span className="absolute top-4 right-4 rounded-full bg-surface-light/80 backdrop-blur-sm px-3 py-1 text-xs font-bold text-electric border border-white/10">
                    {project.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white">{project.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{project.description}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                    <span>{project.cameras} Cameras</span>
                    <span>•</span>
                    <span>{project.location}</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

/* ============================================
   TESTIMONIALS
   ============================================ */
function TestimonialsSection() {
  return (
    <section className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" />
      <div className="section-container relative z-10">
        <SectionHeader badge="Testimonials" title="What Our Clients Say" />
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-14"
        >
          {testimonials.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="glass rounded-4xl p-7 h-full flex flex-col">
                <div className="mb-4 flex gap-1 text-amber-400">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <FiStar key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="flex-1 text-sm leading-7 text-slate-300">"{review.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-electric to-accent text-xs font-bold text-white">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white">{review.name}</p>
                    <p className="text-xs text-slate-500">{review.role} — {review.company}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

/* ============================================
   FAQ SECTION
   ============================================ */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="section-container section-padding">
      <SectionHeader badge="FAQ" title="Frequently Asked Questions" />
      <div className="mx-auto max-w-3xl space-y-3">
        {faqItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <button
              className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-white transition-colors hover:text-electric"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              {item.question}
              {openIndex === i ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
            </button>
            <motion.div
              initial={false}
              animate={{ height: openIndex === i ? 'auto' : 0, opacity: openIndex === i ? 1 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <p className="px-5 pb-5 text-sm leading-7 text-slate-400">{item.answer}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ============================================
   CONTACT CTA
   ============================================ */
function ContactCTA() {
  return (
    <section className="section-container pb-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass rounded-4xl overflow-hidden relative"
      >
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="absolute inset-0 noise-overlay opacity-50" />
        <div className="relative z-10 px-8 py-16 text-center md:px-16 md:py-20">
          <Badge icon={<FiShield size={14} />} className="mb-6">Ready to Get Started?</Badge>
          <h2 className="text-3xl font-black text-white font-display md:text-5xl">
            Secure Your Space Today
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            Get a free site survey and customized security plan. Our experts will assess your
            needs and recommend the best solution within your budget.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/booking">
              <Button variant="primary" arrow>Book Free Survey</Button>
            </Link>
            <Link to="/contact">
              <Button variant="secondary">Contact Us</Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ============================================
   SECTION HEADER
   ============================================ */
function SectionHeader({ badge, title }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-10 max-w-3xl"
    >
      <Badge icon={<FiShield size={14} />} className="mb-4">{badge}</Badge>
      <h2 className="text-3xl font-black tracking-tight text-white font-display md:text-4xl lg:text-5xl">{title}</h2>
    </motion.div>
  );
}

/* ============================================
   HOME PAGE
   ============================================ */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesPreview />
      <WhyChooseUsSection />
      <StatsSection />
      <ProjectShowcase />
      <TestimonialsSection />
      <FAQSection />
      <ContactCTA />
    </>
  );
}
