import React, { useState } from 'react';
import {
  HardHat,
  ShieldCheck,
  Award,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  HelpCircle,
  Send,
  AlertCircle
} from 'lucide-react';

export default function AboutContactPage() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'How does BUILDCONNECTION ensure tradesperson and contractor quality?',
      a: 'We perform administrative credential checks verifying trade experience, past job portfolios, council registration (e.g. Council of Architecture, Grade-A Wireman licenses), and authentic customer reviews collected exclusively from confirmed completed bookings.',
    },
    {
      q: 'Are the prices on BUILDCONNECTION fixed or estimated?',
      a: 'All minimum prices shown on directory cards are transparent starting baseline estimates based on regional standard market averages. When you post a service request or book a site survey, professionals provide itemized quotations reflecting your exact measurements and material grade.',
    },
    {
      q: 'Can I hire daily-wage workers through BUILDCONNECTION?',
      a: 'Yes. Lead supervisors for skilled and semi-skilled daily-wage squads (for excavation, concrete mixing, debris clearing, and slab curing) are registered with explicit daily rate minimums and radius availability.',
    },
    {
      q: 'How does quotation comparison work?',
      a: 'When you submit an open service request, nearby qualified contractors in that trade submit formal proposals. You can inspect labor vs material costs, completion duration in days, and warranty conditions side-by-side on our Compare Quotations page before committing.',
    },
  ];

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 3.5rem' }}>
        <span className="badge badge-amber text-xs mb-2">ABOUT BUILDCONNECTION</span>
        <h1 className="text-3xl font-extrabold mb-3">Hyperlocal Construction & Interior Transparency</h1>
        <p className="text-muted text-base" style={{ lineHeight: 1.6 }}>
          BUILDCONNECTION was founded with a single mission: to eliminate opacity, inflated middleman markups, and unverified contractor claims in local home construction and interior renovations.
        </p>
      </div>

      {/* Values Pillars */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        <div className="card" style={{ padding: '1.75rem' }}>
          <div
            style={{
              background: '#fef3c7',
              color: '#d97706',
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-bold text-base mb-2">Verified Trade Credentials</h3>
          <p className="text-xs text-muted" style={{ lineHeight: 1.6 }}>
            Every architect, civil engineer, master mason, and technician profile displays verifiable certifications, years in the surrounding area, and authentic completed projects.
          </p>
        </div>

        <div className="card" style={{ padding: '1.75rem' }}>
          <div
            style={{
              background: '#ecfdf5',
              color: '#047857',
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Award size={24} />
          </div>
          <h3 className="font-bold text-base mb-2">Transparent Baseline Rates</h3>
          <p className="text-xs text-muted" style={{ lineHeight: 1.6 }}>
            No concealed fees. We publish transparent minimum prices across per-day, per-sq.ft, and per-project units so you always have a fair benchmark before negotiating.
          </p>
        </div>

        <div className="card" style={{ padding: '1.75rem' }}>
          <div
            style={{
              background: '#eff6ff',
              color: '#1d4ed8',
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <HardHat size={24} />
          </div>
          <h3 className="font-bold text-base mb-2">Direct Local Connections</h3>
          <p className="text-xs text-muted" style={{ lineHeight: 1.6 }}>
            Connect directly with verified independent craftspeople in your GPS radius. Zero platform booking commissions extracted from honest tradespeople wages.
          </p>
        </div>
      </div>

      {/* FAQ & Contact Grid */}
      <div className="grid grid-cols-2 gap-8">
        {/* FAQs */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <HelpCircle size={20} className="text-primary" />
            <span>Frequently Asked Questions</span>
          </h2>
          <div className="flex flex-col gap-4">
            {faqs.map((f, i) => (
              <div key={i} className="card" style={{ padding: '1.25rem' }}>
                <h4 className="font-bold text-sm text-secondary mb-1.5">{f.q}</h4>
                <p className="text-xs text-muted" style={{ lineHeight: 1.6 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 className="text-xl font-bold mb-2">Contact BUILDCONNECTION Support</h2>
          <p className="text-xs text-muted mb-4">
            Have questions about local contractor verification or enterprise construction packages? Send us a message.
          </p>

          {submitted ? (
            <div className="estimate-disclaimer text-success" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
              <CheckCircle2 size={18} />
              <span>Thank you! Your message has been received. Our construction support desk will respond within 4 business hours.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Inquiry Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Contractor verification inquiry, architectural consultation"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message Details</label>
                <textarea
                  required
                  rows={3}
                  placeholder="How can our construction desk help you today?"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-sm">
                <Send size={15} />
                <span>Send Message</span>
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2 text-xs text-muted">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-primary" /> support@BUILDCONNECTION.com
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-primary" /> +91 (022) 8000-BUILD
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-primary" /> BUILDCONNECTION Tower, BKC Urban Complex, Mumbai 400051
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
