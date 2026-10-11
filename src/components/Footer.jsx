import React from 'react';
import { Link } from 'lucide-react';
import { HardHat, ShieldCheck, MapPin, Phone, Mail, Award, AlertCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#cbd5e1', paddingTop: '3.5rem', paddingBottom: '2rem', marginTop: '4rem' }}>
      <div className="container">
        <div className="grid grid-cols-4 gap-8" style={{ marginBottom: '3rem' }}>
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                style={{
                  background: '#d97706',
                  color: '#ffffff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HardHat size={22} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Build<span style={{ color: '#f59e0b' }}>Near</span>
              </span>
            </div>
            <p className="text-sm text-muted" style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '1rem' }}>
              Your hyperlocal construction & interior services marketplace. Find licensed architects, master masons, civil engineers, carpenters, and electricians in your radius with verified ratings and transparent baseline pricing.
            </p>
            <div className="flex items-center gap-2 text-xs" style={{ color: '#10b981', fontWeight: 600 }}>
              <ShieldCheck size={16} /> Admin-Verified Trades & Direct Contact
            </div>
          </div>

          {/* Construction Services */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem' }}>
              House Construction
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li><a href="/construction" style={{ color: '#94a3b8' }}>Architectural Planning (2D/3D)</a></li>
              <li><a href="/construction" style={{ color: '#94a3b8' }}>Soil Testing & Structural Design</a></li>
              <li><a href="/construction" style={{ color: '#94a3b8' }}>Foundation & Column Casting</a></li>
              <li><a href="/construction" style={{ color: '#94a3b8' }}>Brick Masonry & AAC Blocks</a></li>
              <li><a href="/construction" style={{ color: '#94a3b8' }}>Turnkey Construction Packages</a></li>
              <li><a href="/construction" style={{ color: '#94a3b8' }}>Construction Cost Estimator</a></li>
            </ul>
          </div>

          {/* Interior & Specialists */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem' }}>
              Interior & Specialist Trades
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li><a href="/interior" style={{ color: '#94a3b8' }}>Modular Kitchen Installation</a></li>
              <li><a href="/interior" style={{ color: '#94a3b8' }}>Wardrobes & Custom Woodwork</a></li>
              <li><a href="/interior" style={{ color: '#94a3b8' }}>False Ceiling & Cove Lighting</a></li>
              <li><a href="/nearby?category=ELECTRICIAN" style={{ color: '#94a3b8' }}>Conduit Wiring & Linemen</a></li>
              <li><a href="/nearby?category=PLUMBER" style={{ color: '#94a3b8' }}>CPVC Plumbing & Sanitary</a></li>
              <li><a href="/nearby?category=DAILY_WAGE_WORKER" style={{ color: '#94a3b8' }}>Daily-Wage Labor Squads</a></li>
            </ul>
          </div>

          {/* Quick Demo Credentials & Notice */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem' }}>
              Evaluator Test Credentials
            </h4>
            <div style={{ background: '#1e293b', padding: '12px', borderRadius: '10px', fontSize: '0.75rem', lineHeight: 1.5, border: '1px solid #334155' }}>
              <div style={{ color: '#f59e0b', fontWeight: 700, marginBottom: '4px' }}>Demo Accounts:</div>
              <div style={{ color: '#e2e8f0' }}><strong>Customer:</strong> customer@BUILDCONNECTION.com / Customer@123</div>
              <div style={{ color: '#e2e8f0' }}><strong>Pro Mason:</strong> rajesh.mason@BUILDCONNECTION.com / Pro@123</div>
              <div style={{ color: '#e2e8f0' }}><strong>Admin:</strong> admin@BUILDCONNECTION.com / Admin@123</div>
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#94a3b8' }}>
              <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} /> Hyperlocal coverage in Mumbai, Bengaluru, Pune, Delhi NCR & more.
            </div>
          </div>
        </div>

        {/* Pricing Transparency & Safety Disclaimer Banner */}
        <div
          style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.875rem',
            marginBottom: '2rem',
          }}
        >
          <AlertCircle size={22} className="text-warning" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '0.8125rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            <strong>Transparent Pricing Disclaimer:</strong> All minimum rates listed on BUILDCONNECTION (per hour, day, sq.ft, or project) represent regional starting estimates for initial baseline budget calculations. Binding contracts and quotations are finalized directly between client and service professional upon site inspection and material review.
          </p>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: '1px solid #334155',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8125rem',
            color: '#64748b',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>© {new Date().getFullYear()} BUILDCONNECTION Technologies. Local Construction & Interior Services Marketplace.</div>
          <div className="flex items-center gap-4">
            <a href="/about" style={{ color: '#94a3b8' }}>About Platform</a>
            <a href="/services" style={{ color: '#94a3b8' }}>All Trades</a>
            <a href="/nearby" style={{ color: '#94a3b8' }}>GPS Search</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
