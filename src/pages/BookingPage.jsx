import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  CheckCircle,
  MapPin,
  Phone,
  ShieldCheck,
  DollarSign,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import EstimateBadge from '../components/EstimateBadge';

export default function BookingPage() {
  const { professionalId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    customerAddress: user?.address || '',
    customerPhone: user?.phone || '',
    serviceTitle: '',
    customerNotes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPro = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/professionals/${professionalId}`);
        if (res.success) {
          setProfessional(res.data);
          setFormData((prev) => ({
            ...prev,
            serviceTitle: `${res.data.categoryTitle || res.data.category} Site Consultation & Work`,
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (professionalId) {
      fetchPro();
    }
  }, [professionalId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in or select a demo account to confirm booking.');
      navigate('/auth?mode=login');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        scheduledDate: formData.scheduledDate,
        customerAddress: formData.customerAddress,
        customerPhone: formData.customerPhone,
        serviceTitle: formData.serviceTitle,
        customerNotes: formData.customerNotes,
        agreedPrice: professional.minimumPrice,
        pricingUnit: professional.pricingUnit,
      };

      const res = await apiClient.post(`/bookings/direct/${professional.id}`, payload);
      if (res.success) {
        alert(`Booking #${res.data.bookingNumber} confirmed successfully!`);
        navigate('/customer-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to complete booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container py-24 text-center text-muted">Loading booking details...</div>;
  }

  if (!professional) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-xl font-bold mb-2">Professional Not Found</h2>
        <Link to="/nearby" className="btn btn-primary btn-sm">Find Nearby Specialists</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '680px', paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <Link to={`/professionals/${professional.id}`} className="text-xs font-bold text-muted hover:text-primary flex items-center gap-1 mb-4">
        <ArrowLeft size={14} /> Back to Profile
      </Link>

      <div className="card" style={{ padding: '2rem' }}>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="text-primary" size={24} />
          <h1 className="text-2xl font-bold">Schedule Service Booking</h1>
        </div>
        <p className="text-xs text-muted mb-6">
          Book an inspection or work visit with {professional.fullName}. No advance upfront payment required.
        </p>

        {error && (
          <div className="estimate-disclaimer text-danger mb-4" style={{ background: '#fef2f2', borderColor: '#fca5a5' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Professional Summary strip */}
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div className="flex items-center gap-3">
            <img
              src={
                professional.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(professional.fullName)}&background=d97706&color=fff`
              }
              alt={professional.fullName}
              style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <div>
              <div className="font-bold text-sm text-secondary">{professional.fullName}</div>
              <div className="text-xs text-primary font-semibold">{professional.categoryTitle}</div>
              <div className="text-xs text-muted">{professional.city} • {professional.experienceYears}+ Yrs Exp</div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div className="text-xs text-muted flex items-center justify-end gap-1">
              Starting Rate <EstimateBadge text="Est." size="xs" />
            </div>
            <div className="font-extrabold text-lg text-primary">
              ₹{professional.minimumPrice?.toLocaleString()} <span className="text-xs text-muted font-normal">/ {professional.pricingUnit?.replace('PER_', '').toLowerCase()}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="form-group">
            <label className="form-label">Service Title / Requirement</label>
            <input
              type="text"
              name="serviceTitle"
              required
              value={formData.serviceTitle}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Preferred Date *</label>
              <input
                type="date"
                name="scheduledDate"
                required
                value={formData.scheduledDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Contact *</label>
              <input
                type="text"
                name="customerPhone"
                required
                placeholder="+91 98765 43210"
                value={formData.customerPhone}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Site Visit Address *</label>
            <input
              type="text"
              name="customerAddress"
              required
              placeholder="House/Plot No, building, street, landmark, city"
              value={formData.customerAddress}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project Instructions & Site Notes</label>
            <textarea
              name="customerNotes"
              rows={3}
              placeholder="e.g. Dimensions of wall, soil excavation depth, bring equipment, gate entry info..."
              value={formData.customerNotes}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          <div className="estimate-disclaimer my-2">
            <ShieldCheck size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Transparent Terms:</strong> The baseline rate displayed above serves as the initial starting reference. Final billing is settled directly between you and {professional.fullName} based on verified scope and materials.
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-4 pt-3 border-t border-slate-100">
            <Link to={`/professionals/${professional.id}`} className="btn btn-outline">
              Cancel
            </Link>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Confirming...' : 'Confirm & Schedule Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
