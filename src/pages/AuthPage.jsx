import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  HardHat,
  User,
  ShieldCheck,
  Building2,
  Lock,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, demoLogin } = useAuth();
  const { city } = useLocation();

  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'REGISTER' : 'LOGIN');
  const [selectedRole, setSelectedRole] = useState('CUSTOMER'); // CUSTOMER or PROFESSIONAL

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    city: city || 'Mumbai',
    address: '',
    // Professional specific
    category: 'MASON',
    categoryTitle: 'Master Mason & Brickwork',
    experienceYears: 5,
    qualifications: 'Certified Tradesman',
    skills: 'Brickwork, Plastering, Foundation',
    minimumPrice: 750,
    pricingUnit: 'PER_DAY',
    serviceRadiusKm: 25,
    bio: 'Dedicated construction professional with proven track record of quality craftsmanship.',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (mode === 'LOGIN') {
        const res = await login(formData.email, formData.password);
        if (res.role === 'ROLE_ADMIN') navigate('/admin');
        else if (res.role === 'ROLE_PROFESSIONAL') navigate('/pro-dashboard');
        else navigate('/customer-dashboard');
      } else {
        const payload = {
          ...formData,
          role: selectedRole === 'PROFESSIONAL' ? 'ROLE_PROFESSIONAL' : 'ROLE_CUSTOMER',
          minimumPrice: formData.minimumPrice ? parseFloat(formData.minimumPrice) : 500,
          experienceYears: formData.experienceYears ? parseInt(formData.experienceYears, 10) : 2,
          serviceRadiusKm: formData.serviceRadiusKm ? parseFloat(formData.serviceRadiusKm) : 25,
        };
        const res = await register(payload);
        if (res.role === 'ROLE_PROFESSIONAL') navigate('/pro-dashboard');
        else navigate('/customer-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoClick = async (demoRole) => {
    try {
      setSubmitting(true);
      setError(null);
      const res = await demoLogin(demoRole);
      if (res.role === 'ROLE_ADMIN') navigate('/admin');
      else if (res.role === 'ROLE_PROFESSIONAL') navigate('/pro-dashboard');
      else navigate('/customer-dashboard');
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '640px', paddingTop: '3rem', paddingBottom: '4rem' }}>
      {/* 1-Click Evaluator Demo Banner */}
      <div
        className="card mb-6"
        style={{
          background: '#fffbeb',
          borderColor: '#fde68a',
          padding: '1.25rem',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Zap size={18} className="text-primary" />
          <h3 className="font-bold text-sm text-amber-900">1-Click Evaluator Demo Accounts</h3>
        </div>
        <p className="text-xs text-amber-800 mb-3">
          Skip manual typing. Click any role below to instantly log in as a pre-seeded account:
        </p>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleDemoClick('CUSTOMER')}
            className="btn btn-outline-primary btn-sm"
            style={{ backgroundColor: '#ffffff' }}
          >
            👤 Customer Demo
          </button>
          <button
            type="button"
            onClick={() => handleDemoClick('PROFESSIONAL')}
            className="btn btn-outline-primary btn-sm"
            style={{ backgroundColor: '#ffffff' }}
          >
            🧱 Pro Mason Demo
          </button>
          <button
            type="button"
            onClick={() => handleDemoClick('ADMIN')}
            className="btn btn-outline-primary btn-sm"
            style={{ backgroundColor: '#ffffff' }}
          >
            🛡️ Admin Demo
          </button>
        </div>
      </div>

      {/* Main Auth Card */}
      <div className="card" style={{ padding: '2rem' }}>
        {/* Toggle Mode Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => { setMode('LOGIN'); setError(null); }}
            className={`flex-1 py-2 text-sm font-bold border-b-2 ${
              mode === 'LOGIN' ? 'border-amber-600 text-primary' : 'border-transparent text-muted'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('REGISTER'); setError(null); }}
            className={`flex-1 py-2 text-sm font-bold border-b-2 ${
              mode === 'REGISTER' ? 'border-amber-600 text-primary' : 'border-transparent text-muted'
            }`}
          >
            Create New Account
          </button>
        </div>

        {error && (
          <div className="estimate-disclaimer text-danger mb-4" style={{ background: '#fef2f2', borderColor: '#fca5a5' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selector when Registering */}
        {mode === 'REGISTER' && (
          <div className="mb-6">
            <label className="form-label mb-2 block">I want to join BUILDCONNECTION as:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('CUSTOMER')}
                className={`btn ${selectedRole === 'CUSTOMER' ? 'btn-primary' : 'btn-outline'}`}
                style={{ justifyContent: 'flex-start', padding: '10px 14px' }}
              >
                <User size={18} />
                <div style={{ textAlign: 'left' }}>
                  <div className="font-bold text-sm">Property Owner</div>
                  <div className="text-xs opacity-80 font-normal">Hire & post requests</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('PROFESSIONAL')}
                className={`btn ${selectedRole === 'PROFESSIONAL' ? 'btn-primary' : 'btn-outline'}`}
                style={{ justifyContent: 'flex-start', padding: '10px 14px' }}
              >
                <HardHat size={18} />
                <div style={{ textAlign: 'left' }}>
                  <div className="font-bold text-sm">Professional / Pro</div>
                  <div className="text-xs opacity-80 font-normal">Receive job leads</div>
                </div>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === 'REGISTER' && (
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="e.g. Ramesh Sharma"
                value={formData.fullName}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              name="password"
              required
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {mode === 'REGISTER' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address / Service Base *</label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Area / Neighborhood landmark"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {/* Professional Specific Profile Fields */}
              {selectedRole === 'PROFESSIONAL' && (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '0.5rem' }}>
                  <div className="text-xs font-bold text-primary uppercase mb-3">Professional Trade Details:</div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="form-group">
                      <label className="form-label">Trade Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="MASON">Master Mason & Brickwork</option>
                        <option value="CIVIL_ENGINEER">Civil Engineer</option>
                        <option value="ARCHITECT">Architect & 3D Planner</option>
                        <option value="BUILDER_CONTRACTOR">Turnkey Builder / Contractor</option>
                        <option value="INTERIOR_DESIGNER">Interior Designer</option>
                        <option value="ELECTRICIAN">Licensed Electrician</option>
                        <option value="PLUMBER">Plumber & Sanitary</option>
                        <option value="CARPENTER">Carpenter & Woodwork</option>
                        <option value="PAINTER">Painter & Waterproofing</option>
                        <option value="DAILY_WAGE_WORKER">Daily-Wage Labor Squad</option>
                        <option value="WELDER">Welder & Steel Fabricator</option>
                        <option value="LINEMAN">Lineman & High Power</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Trade Headline / Title</label>
                      <input
                        type="text"
                        name="categoryTitle"
                        value={formData.categoryTitle}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="form-group">
                      <label className="form-label">Starting Minimum Rate (₹)</label>
                      <input
                        type="number"
                        name="minimumPrice"
                        value={formData.minimumPrice}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Pricing Unit</label>
                      <select
                        name="pricingUnit"
                        value={formData.pricingUnit}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="PER_DAY">Per Day</option>
                        <option value="PER_SQFT">Per Sq.Ft</option>
                        <option value="PER_HOUR">Per Hour</option>
                        <option value="PER_PROJECT">Per Project</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="form-group">
                      <label className="form-label">Years of Experience</label>
                      <input
                        type="number"
                        name="experienceYears"
                        value={formData.experienceYears}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Service Radius (km)</label>
                      <input
                        type="number"
                        name="serviceRadiusKm"
                        value={formData.serviceRadiusKm}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <button type="submit" disabled={submitting} className="btn btn-primary mt-3" style={{ padding: '0.75rem' }}>
            {submitting ? 'Authenticating...' : mode === 'LOGIN' ? 'Sign In to BUILDCONNECTION' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
