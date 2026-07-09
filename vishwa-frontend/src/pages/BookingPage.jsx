import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiPhone, FiMail, FiMapPin, FiTool, FiMessageSquare, FiCheck, FiArrowRight, FiArrowLeft, FiShield } from 'react-icons/fi';
import PageShell from '../components/layout/PageShell';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const steps = ['Personal Info', 'Service Details', 'Review & Submit'];

const serviceOptions = [
  'CCTV Installation',
  'CCTV Maintenance',
  'IP Camera Solutions',
  'Networking Solutions',
  'Computer Hardware Support',
  'Biometric Systems',
  'Data Backup',
  'Troubleshooting',
  'Internet Support',
  'AMC Maintenance',
];

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  location: '',
  service: 'CCTV Installation',
  cameras: 1,
  preferredDate: '',
  preferredTime: '',
  message: '',
};

const sanitizeName = (value) => value.replace(/[^A-Za-z\s.'-]/g, '');
const sanitizePhone = (value) => value.replace(/[^\d+\s()-]/g, '');

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field, value) => setForm({ ...form, [field]: value });

  const canProceed = () => {
    if (currentStep === 0) return form.name && form.phone && form.email;
    if (currentStep === 1) return form.location && form.service && form.preferredDate && form.preferredTime;
    return true;
  };

  const mapServiceType = (service) => {
    switch (service) {
      case 'CCTV Installation':
      case 'IP Camera Solutions':
        return 'New CCTV Installation';
      case 'CCTV Maintenance':
      case 'AMC Maintenance':
        return 'Maintenance';
      case 'Computer Hardware Support':
      case 'Troubleshooting':
      case 'Internet Support':
        return 'Repair';
      case 'Biometric Systems':
      case 'Data Backup':
        return 'Camera Upgrade';
      default:
        return 'New CCTV Installation';
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    let timeStr = form.preferredTime;
    if (timeStr && timeStr.split(':').length === 2) {
      timeStr += ':00';
    }

    const payload = {
      fullName: form.name,
      phone: form.phone,
      email: form.email,
      serviceAddress: form.location,
      serviceType: mapServiceType(form.service),
      cameras: Number(form.cameras || 1),
      preferredDate: form.preferredDate,
      preferredTime: timeStr,
      message: form.message,
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit booking request.');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm(emptyForm);
    setCurrentStep(0);
    setSubmitted(false);
    setError('');
  };

  if (submitted) {
    return (
      <PageShell badge="Booking Confirmed" title="Thank You!">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-4xl p-10 text-center max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-emerald-500/20 border-2 border-emerald-500/40"
          >
            <FiCheck size={36} className="text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white font-display">Booking Submitted Successfully!</h2>
          <p className="mt-4 text-slate-400 leading-7">
            Your service request has been received. Our team will contact you within 24 hours to confirm the details and schedule your visit.
          </p>
          <div className="mt-6 glass rounded-2xl p-5 text-left">
            <h3 className="text-sm font-bold text-slate-300 mb-3">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="text-white font-medium">{form.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Phone</span><span className="text-white font-medium">{form.phone}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="text-white font-medium">{form.email}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Service</span><span className="text-white font-medium">{form.service}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Location</span><span className="text-white font-medium">{form.location}</span></div>
            </div>
          </div>
          <div className="mt-8">
            <Button variant="primary" onClick={reset} arrow>Book Another Service</Button>
          </div>
        </motion.div>
      </PageShell>
    );
  }

  return (
    <PageShell
      badge="Online Booking"
      title="Schedule a Service Visit"
      subtitle="Fill out the form below and our team will reach out to confirm your appointment."
    >
      {/* Progress Indicator */}
      <div className="mx-auto max-w-2xl mb-10">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`grid h-10 w-10 place-items-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                  i < currentStep
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                    : i === currentStep
                    ? 'border-electric bg-electric/20 text-electric shadow-glow'
                    : 'border-white/10 bg-white/5 text-slate-500'
                }`}>
                  {i < currentStep ? <FiCheck size={16} /> : i + 1}
                </div>
                <span className={`mt-2 text-xs font-semibold ${
                  i <= currentStep ? 'text-white' : 'text-slate-500'
                }`}>
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`mx-3 h-px flex-1 transition-colors duration-300 ${
                  i < currentStep ? 'bg-emerald-500/50' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <div className="mx-auto max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-4xl p-6 md:p-8"
          >
            {currentStep === 0 && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-white mb-6">Personal Information</h3>
                <FormField icon={<FiUser />} label="Full Name" value={form.name} onChange={(v) => update('name', sanitizeName(v))} placeholder="Enter your full name" required />
                <FormField icon={<FiPhone />} label="Phone Number" value={form.phone} onChange={(v) => update('phone', sanitizePhone(v))} placeholder="+91 XXXXX XXXXX" type="tel" inputMode="tel" maxLength={18} required />
                <FormField icon={<FiMail />} label="Email Address" value={form.email} onChange={(v) => update('email', v)} placeholder="your@email.com" type="email" required />
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-white mb-6">Service Details</h3>
                <FormField icon={<FiMapPin />} label="Location / Address" value={form.location} onChange={(v) => update('location', v)} placeholder="Enter your service location" required />
                <label className="grid gap-2 text-sm font-semibold text-slate-300">
                  <span className="flex items-center gap-2"><FiTool size={14} className="text-electric" /> Service Required</span>
                  <select className="premium-input" value={form.service} onChange={(e) => update('service', e.target.value)}>
                    {serviceOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </label>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="grid gap-2 text-sm font-semibold text-slate-300">
                    <span className="flex items-center gap-2">Number of Cameras</span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      className="premium-input"
                      value={form.cameras}
                      onChange={(e) => update('cameras', Math.max(1, parseInt(e.target.value) || 1))}
                      required
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-300">
                    <span className="flex items-center gap-2">Preferred Date</span>
                    <input
                      type="date"
                      className="premium-input animate-none"
                      style={{ colorScheme: 'dark' }}
                      value={form.preferredDate}
                      onChange={(e) => update('preferredDate', e.target.value)}
                      required
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-300">
                    <span className="flex items-center gap-2">Preferred Time</span>
                    <input
                      type="time"
                      className="premium-input"
                      style={{ colorScheme: 'dark' }}
                      value={form.preferredTime}
                      onChange={(e) => update('preferredTime', e.target.value)}
                      required
                    />
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-semibold text-slate-300">
                  <span className="flex items-center gap-2"><FiMessageSquare size={14} className="text-electric" /> Additional Message</span>
                  <textarea className="premium-input min-h-[120px] resize-y" value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Describe your requirements (optional)" />
                </label>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-6">Review Your Details</h3>
                <div className="space-y-4">
                  {[
                    ['Name', form.name, FiUser],
                    ['Phone', form.phone, FiPhone],
                    ['Email', form.email, FiMail],
                    ['Location', form.location, FiMapPin],
                    ['Service', form.service, FiTool],
                    ['Cameras', form.cameras, FiShield],
                    ['Preferred Date', form.preferredDate, FiCheck],
                    ['Preferred Time', form.preferredTime, FiCheck],
                    ['Message', form.message || 'None', FiMessageSquare],
                  ].map(([label, value, Icon]) => (
                    <div key={label} className="flex items-start gap-3 rounded-xl bg-white/5 p-4 border border-white/5">
                      <Icon size={16} className="text-electric mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                        <p className="text-sm font-medium text-white mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-semibold text-rose-400">
                {error}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              {currentStep > 0 ? (
                <Button variant="ghost" onClick={() => setCurrentStep(currentStep - 1)} icon={<FiArrowLeft size={16} />} disabled={loading}>
                  Back
                </Button>
              ) : <div />}

              {currentStep < steps.length - 1 ? (
                <Button
                  variant="primary"
                  arrow
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceed()}
                  className={!canProceed() ? 'opacity-50 pointer-events-none' : ''}
                >
                  Continue
                </Button>
              ) : (
                <Button variant="primary" arrow onClick={handleSubmit} loading={loading}>
                  Submit Booking
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </PageShell>
  );
}

function FormField({ icon, label, value, onChange, ...props }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-300">
      <span className="flex items-center gap-2">
        {icon && <span className="text-electric">{icon}</span>}
        {label}
      </span>
      <input
        className="premium-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </label>
  );
}
