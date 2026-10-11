import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calculator,
  CheckCircle,
  Clock,
  ShieldCheck,
  Award,
  AlertCircle,
  ArrowLeft,
  DollarSign,
  Layers,
  ArrowRight
} from 'lucide-react';
import apiClient from '../api/apiClient';
import StarRating from '../components/StarRating';

export default function CompareQuotationsPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

  useEffect(() => {
    const fetchQuotesAndRequest = async () => {
      try {
        setLoading(true);
        const [reqRes, quotesRes] = await Promise.all([
          apiClient.get(`/requests/${requestId}`),
          apiClient.get(`/quotations/request/${requestId}`),
        ]);

        if (reqRes.success) {
          setRequest(reqRes.data);
          document.title = `Compare Quotes – ${reqRes.data.title} | BUILDCONNECTION`;
        }
        if (quotesRes.success) setQuotations(quotesRes.data);
      } catch (err) {
        console.error('Failed to load quotes for comparison', err);
      } finally {
        setLoading(false);
      }
    };

    document.title = 'Compare Quotations | BUILDCONNECTION';
    fetchQuotesAndRequest();
  }, [requestId]);

  const handleAcceptQuote = async (quoteId, proName) => {
    if (!window.confirm(`Are you sure you want to accept the quotation from ${proName}? This will confirm your booking and reject other competing quotes.`)) {
      return;
    }

    setAcceptingId(quoteId);
    try {
      const res = await apiClient.post(`/quotations/${quoteId}/accept`);
      if (res.success) {
        alert(`Quotation accepted! Booking #${res.data.bookingNumber} has been confirmed. You can track this in your dashboard.`);
        navigate('/customer-dashboard');
      }
    } catch (err) {
      alert(err.message || 'Failed to accept quotation');
    } finally {
      setAcceptingId(null);
    }
  };

  if (loading) {
    return <div className="container py-24 text-center text-muted">Loading quotations comparison matrix...</div>;
  }

  if (!request) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-xl font-bold mb-2">Service Request Not Found</h2>
        <Link to="/customer-dashboard" className="btn btn-primary btn-sm">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <Link to="/customer-dashboard" className="text-xs font-bold text-muted hover:text-primary flex items-center gap-1 mb-4">
        <ArrowLeft size={14} /> Back to Customer Dashboard
      </Link>

      {/* Header Banner */}
      <div className="card mb-6" style={{ background: '#0f172a', color: '#ffffff', borderColor: '#334155', padding: '1.75rem' }}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <span className="badge badge-amber text-xs mb-2">QUOTATION COMPARISON</span>
            <h1 className="text-2xl font-bold" style={{ color: '#ffffff' }}>
              Compare Proposals for: {request.title}
            </h1>
            <p className="text-sm text-muted" style={{ color: '#94a3b8', marginTop: '4px' }}>
              {request.propertyType} • {request.city} {request.areaSqFt ? `• ${request.areaSqFt} sq.ft` : ''}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div className="text-xs text-muted" style={{ color: '#94a3b8' }}>Client Budget Estimate:</div>
            <div className="text-xl font-bold text-primary">
              {request.estimatedBudget ? `₹${request.estimatedBudget.toLocaleString()}` : 'Budget Flexible'}
            </div>
            <span className={`badge ${request.status === 'ACCEPTED' ? 'badge-green' : 'badge-amber'} text-xs mt-1`}>
              Status: {request.status}
            </span>
          </div>
        </div>
      </div>

      {quotations.length === 0 ? (
        <div className="card text-center py-16">
          <AlertCircle size={36} className="text-muted mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-1">No Quotations Received Yet</h3>
          <p className="text-sm text-muted mb-4">
            Nearby verified tradespeople in {request.category} have been notified. Check back shortly for submitted proposals.
          </p>
          <Link to="/nearby" className="btn btn-outline-primary btn-sm">
            Browse & Invite Additional Tradespeople
          </Link>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">
              Competing Quotations Received ({quotations.length})
            </h2>
            <div className="text-xs text-muted">
              Compare labor vs material ratios, estimated timelines, and workmanship warranties.
            </div>
          </div>

          {/* Quotations Comparison Grid */}
          <div className="grid grid-cols-2 gap-6">
            {quotations.map((quote) => {
              const isAccepted = quote.status === 'ACCEPTED';
              const isRejected = quote.status === 'REJECTED';

              return (
                <div
                  key={quote.id}
                  className="card flex flex-col justify-between"
                  style={{
                    borderColor: isAccepted ? '#10b981' : isRejected ? '#e2e8f0' : '#d97706',
                    borderWidth: isAccepted ? '2px' : '1px',
                    backgroundColor: isAccepted ? '#f0fdf4' : '#ffffff',
                    padding: '1.5rem',
                  }}
                >
                  <div>
                    {/* Header: Pro Info */}
                    <div className="flex items-start justify-between mb-3 pb-3 border-b border-slate-100">
                      <Link
                        to={`/professionals/${quote.professionalId}`}
                        className="flex items-center gap-3"
                        style={{ textDecoration: 'none' }}
                        title="View full professional profile"
                      >
                        <img
                          src={
                            quote.professionalAvatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(quote.professionalName || 'Pro')}&background=d97706&color=fff`
                          }
                          alt={quote.professionalName}
                          style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', border: '2px solid #f8fafc' }}
                        />
                        <div>
                          <div className="font-bold text-base text-secondary">{quote.professionalName}</div>
                          <div className="text-xs text-primary font-semibold">{quote.professionalCategoryTitle}</div>
                          <StarRating rating={quote.professionalRating || 0} size={12} count={quote.professionalReviewsCount || 0} />
                          <div className="text-xs font-semibold" style={{ color: '#d97706', marginTop: '2px' }}>View Profile →</div>
                        </div>
                      </Link>

                      <span
                        className={`badge ${
                          isAccepted ? 'badge-green' : isRejected ? 'badge-slate' : 'badge-amber'
                        }`}
                      >
                        {quote.status}
                      </span>
                    </div>

                    {/* Total Price & Breakdown */}
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
                      <div className="text-xs text-muted">Quoted Total Amount:</div>
                      <div className="text-2xl font-extrabold text-secondary mb-2">
                        ₹{quote.totalAmount?.toLocaleString()}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div style={{ background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <span className="text-muted">Labor Workmanship:</span>
                          <div className="font-bold text-secondary">₹{quote.laborCost?.toLocaleString()}</div>
                        </div>
                        <div style={{ background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <span className="text-muted">Materials & Supply:</span>
                          <div className="font-bold text-secondary">₹{quote.materialCost?.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline & Scope Notes */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-secondary mb-3">
                      <Clock size={15} className="text-primary" />
                      <span>Estimated Duration: <strong>{quote.estimatedDays} Days</strong></span>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs font-bold text-muted uppercase mb-1">Scope & Material Details:</div>
                      <p className="text-xs text-secondary" style={{ lineHeight: 1.6, background: '#f8fafc', padding: '8px 10px', borderRadius: '6px' }}>
                        {quote.breakdownNotes}
                      </p>
                    </div>

                    {quote.termsAndWarranty && (
                      <div className="mb-4">
                        <div className="text-xs font-bold text-muted uppercase mb-1">Warranty & Conditions:</div>
                        <div className="text-xs text-emerald-800 flex items-start gap-1.5" style={{ color: '#047857' }}>
                          <ShieldCheck size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{quote.termsAndWarranty}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Accept CTA Button */}
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                    {isAccepted ? (
                      <div className="flex items-center gap-1.5 text-xs text-success font-bold">
                        <CheckCircle size={16} /> Accepted proposal - Booking active!
                      </div>
                    ) : isRejected ? (
                      <div className="text-xs text-muted">Proposal not accepted.</div>
                    ) : (
                      <button
                        onClick={() => handleAcceptQuote(quote.id, quote.professionalName)}
                        disabled={acceptingId === quote.id || request.status === 'ACCEPTED'}
                        className="btn btn-primary w-full btn-sm"
                        style={{ width: '100%' }}
                      >
                        {acceptingId === quote.id ? 'Confirming...' : 'Accept & Book This Quotation'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
