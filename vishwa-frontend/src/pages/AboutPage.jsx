import { motion } from 'framer-motion';
import { FiShield, FiAward, FiZap, FiHeart, FiTarget, FiEye } from 'react-icons/fi';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { teamMembers, timeline, coreValues } from '../data/team';
import { companyStats } from '../data/stats';
import { useState, useRef, useEffect } from 'react';

const valueIcons = { FiAward, FiShield, FiZap, FiHeart };

export default function AboutPage() {
  return (
    <PageShell
      badge="About Vishwa Technologies"
      title="Securing Businesses Since 2012"
      subtitle="From computer hardware to enterprise-grade surveillance — we've evolved into Telangana's trusted technology and security solutions provider."
    >
      {/* Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass rounded-4xl p-8 md:p-10"
      >
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-2xl font-bold text-white font-display mb-4">Company Overview</h2>
            <p className="text-slate-400 leading-8">
              Vishwa Technologies was established in 2012 by S. Nagaraju with a mission to provide professional
              technology and security solutions to businesses across Telangana. What started as a small computer hardware
              service center has grown into a comprehensive IT and security solutions company.
            </p>
            <p className="mt-4 text-slate-400 leading-8">
              Today, we specialize in CCTV Security Solutions, Computer Hardware, Networking, Biometric Devices,
              Data Backup, Troubleshooting, Internet Support, and Annual Maintenance Services. We proudly serve
              Corporate Clients, Government Organizations, and Defence Establishments with the highest standards of quality.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['12+', 'Years of Experience'],
              ['2000+', 'Projects Delivered'],
              ['1500+', 'Happy Clients'],
              ['10K+', 'Cameras Installed'],
            ].map(([num, label], i) => (
              <div key={label} className="rounded-2xl bg-white/5 p-5 text-center border border-white/5">
                <p className="text-2xl font-black gradient-text-electric font-display">{num}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mission & Vision */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card delay={0.1}>
          <div className="flex items-center gap-3 mb-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary">
              <FiTarget size={22} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white font-display">Our Mission</h3>
          </div>
          <p className="text-sm leading-7 text-slate-400">
            To deliver enterprise-grade security and IT solutions that empower businesses with cutting-edge
            technology, reliable service, and transparent pricing — making premium protection accessible to
            organizations of every size across Telangana and beyond.
          </p>
        </Card>
        <Card delay={0.2}>
          <div className="flex items-center gap-3 mb-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-accent to-purple-700">
              <FiEye size={22} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white font-display">Our Vision</h3>
          </div>
          <p className="text-sm leading-7 text-slate-400">
            To become the most trusted technology and security solutions partner in South India, recognized
            for innovation, service excellence, and a relentless commitment to protecting what matters most
            to our clients — their people, assets, and data.
          </p>
        </Card>
      </div>

      {/* Core Values */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Badge icon={<FiShield size={14} />} className="mb-4">Core Values</Badge>
          <h2 className="text-3xl font-black text-white font-display">What Drives Us</h2>
        </motion.div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {coreValues.map((val, i) => {
            const Icon = valueIcons[val.icon] || FiShield;
            return (
              <Card key={val.title} delay={i * 0.1}>
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl border border-electric/20 bg-electric/10">
                  <Icon size={22} className="text-electric" />
                </div>
                <h3 className="text-lg font-bold text-white">{val.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{val.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Badge icon={<FiShield size={14} />} className="mb-4">Company Journey</Badge>
          <h2 className="text-3xl font-black text-white font-display">Our Timeline</h2>
        </motion.div>
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-electric/50 via-electric/20 to-transparent md:left-1/2" />

          <div className="space-y-8">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex items-start gap-6 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Node */}
                <div className="absolute left-6 -translate-x-1/2 md:left-1/2">
                  <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-electric/40 bg-surface shadow-glow">
                    <span className="text-xs font-black text-electric">{item.year}</span>
                  </div>
                </div>

                {/* Content */}
                <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="glass rounded-2xl p-5">
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                  </div>
                </div>

                {/* Spacer for the other side */}
                <div className="hidden md:block md:w-[calc(50%-2rem)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Badge icon={<FiShield size={14} />} className="mb-4">Our Team</Badge>
          <h2 className="text-3xl font-black text-white font-display">Meet the Experts</h2>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, i) => (
            <Card key={member.id} delay={i * 0.1} variant="interactive">
              <div className="mb-4 grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-electric to-accent text-xl font-bold text-white mx-auto">
                {member.avatar}
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">{member.name}</h3>
                <p className="mt-1 text-xs font-semibold text-electric">{member.role}</p>
                <p className="mt-3 text-sm leading-6 text-slate-400">{member.bio}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
