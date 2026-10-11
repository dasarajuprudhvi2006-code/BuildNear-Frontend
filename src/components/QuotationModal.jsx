import React, { useState } from 'react';
import { X, Send, Calculator, ShieldCheck, AlertCircle } from 'lucide-react';
import apiClient from '../api/apiClient';

export default function QuotationModal({ isOpen, onClose, serviceRequest, onSuccess }) {
  const [formData, setFormData] = useState({
    totalAmount: '',
    laborCost: '',
    materialCost: '',
    estimatedDays: '14',
    breakdownNotes: '',
    termsAndWarranty: 'Includes 1-year workmanship warranty and free 30-day snag rectification.',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !serviceRequest) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto compute labor/material split if total is edited and others are blank
      if (name === 'totalAmount' && value && !prev.laborCost && !prev.materialCost) {
        const total = parseFloat(value) || 0;
        updated.laborCost = Math.round(total * 0.4).toString();
        updated.materialCost = Math.round(total * 0.6).toString();
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        serviceRequestId: serviceRequest.id,
        totalAmount: parseFloat(formData.totalAmount),
        laborCost: formData.laborCost ? parseFloat(formData.laborCost) : null,
        materialCost: formData.materialCost ? parseFloat(formData.materialCost) : null,
        estimatedDays: parseInt(formData.estimatedDays, 10),
        breakdownNotes: formData.breakdownNotes,
        termsAndWarranty: formData.termsAndWarranty,
      };

      const res = await apiClient.post('/quotations', payload);
      if (res.success) {
        alert('Quotation submitted successfully! The customer can now review and compare your proposal.');
        if (onSuccess) onSuccess(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit quotation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Calculator className="text-primary" size={22} />
            <div>
              <h3 className="text-lg font-bold">Submit Formal Quotation</h3>
              <div className="text-xs text-muted">Proposal for "{serviceRequest.title}"</div>
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

            {/* Request Summary */}
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div className="text-xs text-muted">Client & Property:</div>
              <div className="font-semibold text-sm">{serviceRequest.customerName} • {serviceRequest.propertyType}</div>
              <div className="text-xs text-muted mt-1">{serviceRequest.address}, {serviceRequest.city}</div>
              {serviceRequest.areaSqFt && (
                <div className="text-xs font-bold text-primary mt-1">Area: {serviceRequest.areaSqFt} sq.ft</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Total Quotation Amount (₹) *</label>
              <input
                type="number"
                name="totalAmount"
                required
                placeholder="e.g. 185000"
                value={formData.totalAmount}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="form-label">Estimated Labor Cost (₹)</label>
                <input
                  type="number"
                  name="laborCost"
                  placeholder="e.g. 74000"
                  value={formData.laborCost}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Material Cost (₹)</label>
                <input
                  type="number"
                  name="materialCost"
                  placeholder="e.g. 111000"
                  value={formData.materialCost}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Estimated Completion Time (Days) *</label>
              <input
                type="number"
                name="estimatedDays"
                required
                min="1"
                value={formData.estimatedDays}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Scope & Material Breakdown *</label>
              <textarea
                name="breakdownNotes"
                required
                rows={3}
                placeholder="Itemize the deliverables, materials brands, machine deployment, milestone stages..."
                value={formData.breakdownNotes}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Terms, snags & Warranty</label>
              <input
                type="text"
                name="termsAndWarranty"
                value={formData.termsAndWarranty}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              <Send size={15} />
              <span>{submitting ? 'Submitting...' : 'Send Quotation to Client'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
