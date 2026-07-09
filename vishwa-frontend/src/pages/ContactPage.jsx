import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiUser, FiMessageSquare, FiCheck } from 'react-icons/fi';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const contactInfo = [
  {
    icon: FiPhone,
    title: 'Phone',
    value: '+91 99080 75796',
    sub: 'Call us for immediate assistance',
  },
  {
    icon: FiMail,
    title: 'Email',
    value: 'vishwatechnologies1510@gmail.com',
    sub: 'We reply within 24 hours',
  },
  {
    icon: FiMapPin,
    title: 'Address',
    value: '31, Gruhalakshmi Colony, Karkhana, Secunderabad - 500009, Telangana',
    sub: 'Visit us during business hours',
  },
  {
    icon: FiClock,
    title: 'Business Hours',
    value: 'Monday - Saturday: 9:00 AM - 9:00 PM',
    sub: 'Sunday: Closed',
  },
];

const sanitizeName = (value) => value.replace(/[^A-Za-z\s.'-]/g, '');
const sanitizePhone = (value) => value.replace(/[^\d+\s()-]/g, '');

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field, value) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSent(false);

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          serviceType: form.subject,
          message: form.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send message.');
      }

      setSent(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      badge="Contact Us"
      title="Get in Touch"
      subtitle="Have a question or need a quote? Reach out to us and we'll respond within 24 hours."
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left — Contact Info */}
        <div className="space-y-5">
          {contactInfo.map((item, i) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} delay={i * 0.1}>
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-electric/20 bg-electric/10">
                    <Icon size={20} className="text-electric" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-300">{item.value}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{item.sub}</p>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Google Map Placeholder */}
          <Card delay={0.4}>
            <div className="rounded-2xl overflow-hidden">
              <iframe
                title="Vishwa Technologies Location"
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=17.4558899,78.5026851&z=15&output=embed"
              />
            </div>
            <a
              href="https://maps.app.goo.gl/ntvDjevRxvZsqKds8?g_st=ac"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-electric hover:text-electric-300 transition-colors"
            >
              <FiMapPin size={14} /> Open in Google Maps
            </a>
          </Card>
        </div>

        {/* Right — Contact Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="glass rounded-4xl p-6 md:p-8"
        >
          <h3 className="text-xl font-bold text-white font-display mb-6">Send a Message</h3>

          {sent && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-400"
            >
              <FiCheck size={16} /> Message sent successfully! We'll get back to you soon.
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-semibold text-rose-400"
            >
              {error}
            </motion.div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-300">
              <span className="flex items-center gap-2"><FiUser size={14} className="text-electric" /> Full Name</span>
              <input className="premium-input" value={form.name} onChange={(e) => update('name', sanitizeName(e.target.value))} placeholder="Your name" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-300">
              <span className="flex items-center gap-2"><FiMail size={14} className="text-electric" /> Email</span>
              <input className="premium-input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="your@email.com" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-300">
              <span className="flex items-center gap-2"><FiPhone size={14} className="text-electric" /> Phone</span>
              <input className="premium-input" type="tel" inputMode="tel" maxLength={18} value={form.phone} onChange={(e) => update('phone', sanitizePhone(e.target.value))} placeholder="+91 XXXXX XXXXX" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-300">
              <span className="flex items-center gap-2"><FiSend size={14} className="text-electric" /> Subject</span>
              <input className="premium-input" value={form.subject} onChange={(e) => update('subject', e.target.value)} placeholder="How can we help?" required />
            </label>
          </div>

          <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-300">
            <span className="flex items-center gap-2"><FiMessageSquare size={14} className="text-electric" /> Message</span>
            <textarea className="premium-input min-h-[140px] resize-y" value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Describe your requirements..." required />
          </label>

          <div className="mt-6">
            <Button type="submit" variant="primary" arrow className="w-full sm:w-auto" loading={loading}>
              Send Message
            </Button>
          </div>
        </motion.form>
      </div>
    </PageShell>
  );
}
