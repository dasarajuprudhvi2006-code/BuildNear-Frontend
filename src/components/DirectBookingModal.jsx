import React, { useState } from 'react';
import { X, Calendar, MapPin, Phone, CheckCircle, ShieldCheck, DollarSign } from 'lucide-react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import EstimateBadge from './EstimateBadge';

export default function DirectBookingModal({ isOpen, onClose, professional, onSuccess }) {
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    customerAddress: user?.address || '',
    customerPhone: user?.phone || '',
    serviceTitle: professional ? `${professional.categoryTitle || professional.category} Site Visit & Work` : '',
    customerNotes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !professional) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in or select a demo account to book this professional.');
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
        alert(`Booking #${res.data.bookingNumber} confirmed with ${professional.fullName}!`);
        if (onSuccess) onSuccess(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to complete booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-primary" size={22} />
            <div>
              <h3 className="text-lg font-bold">Book {professional.fullName}</h3>
              <div className="text-xs text-muted">Direct appointment & inspection confirmation</div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleBooking}>
          <div className="modal-body flex flex-col gap-3">
            {error && (
              <div className="estimate-disclaimer text-danger" style={{ background: '#fef2f2', borderColor: '#fca5a5' }}>
                {error}
              </div>
            )}

            {/* Pro summary strip */}
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="font-bold text-sm text-secondary">{professional.categoryTitle}</div>
                <div className="text-xs text-muted">{professional.city} • {professional.experienceYears}+ Years Exp</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="text-xs text-muted flex items-center justify-end gap-1">
                  Base Rate <EstimateBadge text="Est." size="xs" />
                </div>
                <div className="font-extrabold text-base text-primary">
                  ₹{professional.minimumPrice?.toLocaleString()} <span className="text-xs text-muted font-normal">/ {professional.pricingUnit?.replace('PER_', '').toLowerCase()}</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Service Description</label>
              <input
                type="text"
                name="serviceTitle"
                value={formData.serviceTitle}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="form-label">Scheduled Date *</label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Phone Number *</label>
                <input
                  type="text"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Site Visit Address *</label>
              <input
                type="text"
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
                placeholder="House/Plot no, street, landmark, city"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Special Notes / Site Directions</label>
              <textarea
                name="customerNotes"
                value={formData.customerNotes}
                onChange={handleChange}
                rows={2}
                placeholder="e.g. Please bring laser measure or tile cutter; gate security code..."
                className="form-textarea"
              />
            </div>

            <div className="estimate-disclaimer">
              <ShieldCheck size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>Pay after confirmation:</strong> No advance payment charged now. Payment is handled directly with {professional.fullName} according to agreed work milestones.
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
