import React, { useState } from 'react';
import { X, FileText, Send, AlertCircle, Calendar, MapPin, DollarSign } from 'lucide-react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';

export default function ServiceRequestModal({
  isOpen,
  onClose,
  targetProfessional = null,
  prefillData = null,
  onSuccess,
}) {
  const { user, isAuthenticated } = useAuth();
  const { city, lat, lng } = useLocation();

  const [formData, setFormData] = useState({
    title: '',
    category: targetProfessional ? targetProfessional.category : 'CIVIL_ENGINEER',
    description: '',
    propertyType: 'Residential Plot / House',
    areaSqFt: '',
    estimatedBudget: '',
    preferredStartDate: '',
    address: user?.address || '',
    city: user?.city || city,
    urgency: 'WITHIN_WEEK',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (prefillData) {
      setFormData((prev) => ({
        ...prev,
        title: prefillData.title || prev.title,
        category: prefillData.category || prev.category,
        description: prefillData.description || prev.description,
        estimatedBudget: prefillData.estimatedBudget || prev.estimatedBudget,
        areaSqFt: prefillData.areaSqFt || prev.areaSqFt,
        propertyType: prefillData.propertyType || prev.propertyType,
      }));
    } else if (targetProfessional) {
      setFormData((prev) => ({
        ...prev,
        category: targetProfessional.category,
      }));
    }
  }, [prefillData, targetProfessional]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in or select a demo account to post a service request.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        areaSqFt: formData.areaSqFt ? parseFloat(formData.areaSqFt) : null,
        estimatedBudget: formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : null,
        targetProfessionalId: targetProfessional ? targetProfessional.id : null,
        latitude: lat,
        longitude: lng,
      };

      const res = await apiClient.post('/requests', payload);
      if (res.success) {
        alert(targetProfessional
          ? `Service request sent to ${targetProfessional.fullName}! They will review and submit a quotation.`
          : 'Service request posted successfully! Local verified professionals in your area can now submit quotations.');
        if (onSuccess) onSuccess(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit service request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <FileText className="text-primary" size={22} />
            <div>
              <h3 className="text-lg font-bold">
                {targetProfessional ? `Request Quotation from ${targetProfessional.fullName}` : 'Post a Construction & Interior Service Request'}
              </h3>
              <div className="text-xs text-muted">
                {targetProfessional ? `Direct inquiry to ${targetProfessional.categoryTitle}` : 'Nearby qualified professionals will review and compete with custom quotations.'}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body flex flex-col gap-3">
            {error && (
              <div className="estimate-disclaimer text-danger" style={{ background: '#fef2f2', borderColor: '#fca5a5' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Service Request Title *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. 2,000 sq.ft RCC Slab Casting, Modular Kitchen Interior, or 3-Phase Rewiring"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="form-label">Trade Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                  disabled={!!targetProfessional}
                >
                  <option value="ARCHITECT">Architect & 3D Planner</option>
                  <option value="CIVIL_ENGINEER">Civil Engineer & Consultant</option>
                  <option value="BUILDER_CONTRACTOR">Turnkey Builder / Contractor</option>
                  <option value="MASON">Master Mason & Brickwork</option>
                  <option value="INTERIOR_DESIGNER">Interior Designer & Modular Stylist</option>
                  <option value="CARPENTER">Carpenter & Furniture</option>
                  <option value="ELECTRICIAN">Licensed Electrician</option>
                  <option value="PLUMBER">Plumber & Drainage</option>
                  <option value="PAINTER">Painter & Waterproofing</option>
                  <option value="DAILY_WAGE_WORKER">Daily-Wage Construction Labor</option>
                  <option value="WELDER">Welder & Steel Fabricator</option>
                  <option value="LINEMAN">Lineman & Power Cabling</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Property Type</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Residential Plot / House">Residential Plot / House</option>
                  <option value="2 BHK / 3 BHK Apartment">2 BHK / 3 BHK Apartment</option>
                  <option value="Independent Villa / Bungalow">Independent Villa / Bungalow</option>
                  <option value="Commercial / Shop">Commercial / Shop</option>
                  <option value="Renovation Site">Renovation Site</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Scope Description & Specifications *</label>
              <textarea
                name="description"
                required
                rows={3}
                placeholder="Describe your requirements, preferred materials, dimensions, site access, and special structural requirements..."
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="form-label">Built-up / Carpet Area (sq.ft)</label>
                <input
                  type="number"
                  name="areaSqFt"
                  placeholder="e.g. 1500"
                  value={formData.areaSqFt}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Approximate Budget (₹)</label>
                <input
                  type="number"
                  name="estimatedBudget"
                  placeholder="e.g. 250000"
                  value={formData.estimatedBudget}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="form-label">Preferred Start Date</label>
                <input
                  type="date"
                  name="preferredStartDate"
                  value={formData.preferredStartDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Project Urgency</label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="IMMEDIATE">Immediate (Within 48 hours)</option>
                  <option value="WITHIN_WEEK">Within a Week</option>
                  <option value="FLEXIBLE">Flexible / Planning Stage</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="form-label">Site Address / Landmark *</label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Plot/Flat number, road, landmark"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">City / Region *</label>
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
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              <Send size={15} />
              <span>{submitting ? 'Submitting...' : 'Post Request & Receive Quotes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
