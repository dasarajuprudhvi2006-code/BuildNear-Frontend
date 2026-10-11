import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  PlusCircle,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Phone,
  MapPin
} from 'lucide-react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import ServiceRequestModal from '../components/ServiceRequestModal';

export default function CustomerDashboard() {
  const { user, refreshUser } = useAuth();

  const [requests, setRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isRequestModalOpen, setRequestModalOpen] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [reqRes, bookRes, statsRes] = await Promise.all([
        apiClient.get('/requests/my'),
        apiClient.get('/bookings/my'),
        apiClient.get('/dashboard/stats'),
      ]);

      if (reqRes.success) setRequests(reqRes.data);
      if (bookRes.success) setBookings(reqRes.data ? bookRes.data : []);
      if (statsRes.success) setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this service request?')) return;
    try {
      const res = await apiClient.put(`/requests/${requestId}/cancel`);
      if (res.success) {
        alert('Service request cancelled.');
        loadDashboardData();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel request');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const reason = prompt('Please state the cancellation reason:');
    if (!reason) return;
    try {
      const res = await apiClient.patch(`/bookings/${bookingId}/cancel`, { reason });
      if (res.success) {
        alert('Booking cancelled.');
        loadDashboardData();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewBooking) return;
    setSubmittingReview(true);
    try {
      const res = await apiClient.post('/reviews', {
        bookingId: reviewBooking.id,
        rating: reviewRating,
        comment: reviewComment,
      });
      if (res.success) {
        alert('Thank you! Your review and rating have been posted.');
        setReviewBooking(null);
        setReviewComment('');
        loadDashboardData();
      }
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="badge badge-amber text-xs mb-1">CUSTOMER PORTAL</div>
          <h1 className="text-2xl font-bold">Welcome, {user?.fullName || 'Property Owner'}</h1>
          <p className="text-xs text-muted">
            Track your service requests, side-by-side quotations, active construction visits, and reviews.
          </p>
        </div>

        <button onClick={() => setRequestModalOpen(true)} className="btn btn-primary btn-sm">
          <PlusCircle size={15} />
          <span>Post New Request</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="card" style={{ padding: '1rem' }}>
          <div className="text-xs text-muted font-medium">Service Requests</div>
          <div className="text-2xl font-extrabold text-secondary mt-1">{requests.length}</div>
        </div>
        <div className="card" style={{ padding: '1rem' }}>
          <div className="text-xs text-muted font-medium">Active Bookings</div>
          <div className="text-2xl font-extrabold text-primary mt-1">
            {bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS').length}
          </div>
        </div>
        <div className="card" style={{ padding: '1rem' }}>
          <div className="text-xs text-muted font-medium">Completed Jobs</div>
          <div className="text-2xl font-extrabold text-success mt-1">
            {bookings.filter((b) => b.status === 'COMPLETED').length}
          </div>
        </div>
        <div className="card" style={{ padding: '1rem' }}>
          <div className="text-xs text-muted font-medium">Reviews Submitted</div>
          <div className="text-2xl font-extrabold text-secondary mt-1">
            {bookings.filter((b) => b.hasReview).length}
          </div>
        </div>
      </div>

      {/* Section 1: My Service Requests (with Compare Quotations link) */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              <span>My Service Requests & Quotations</span>
            </h2>
            <p className="text-xs text-muted">View responses and compare competing bids side-by-side.</p>
          </div>

          <button onClick={() => setRequestModalOpen(true)} className="btn btn-outline-primary btn-sm">
            + Post Request
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-8 text-muted text-sm">
            You haven't posted any service requests yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title & Trade</th>
                  <th>Property & Area</th>
                  <th>Budget</th>
                  <th>Quotations</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div className="font-bold text-sm text-secondary">{req.title}</div>
                      <div className="text-xs text-primary font-semibold">{req.category}</div>
                    </td>
                    <td>
                      <div className="text-xs text-secondary">{req.propertyType}</div>
                      <div className="text-xs text-muted">{req.city} {req.areaSqFt ? `• ${req.areaSqFt} sq.ft` : ''}</div>
                    </td>
                    <td>
                      <div className="text-xs font-semibold">
                        {req.estimatedBudget ? `₹${req.estimatedBudget.toLocaleString()}` : 'Flexible'}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-amber text-xs">
                        {req.quotationsCount} Quote(s)
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          req.status === 'ACCEPTED' ? 'badge-green' : req.status === 'CANCELLED' ? 'badge-red' : 'badge-amber'
                        } text-xs`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {req.quotationsCount > 0 && (
                          <Link
                            to={`/compare-quotes/${req.id}`}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            Compare Quotes ({req.quotationsCount})
                          </Link>
                        )}
                        {req.status === 'PENDING' && (
                          <button
                            onClick={() => handleCancelRequest(req.id)}
                            className="btn btn-outline btn-sm text-danger"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: My Bookings & Jobs Tracker */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              <span>My Construction & Service Bookings</span>
            </h2>
            <p className="text-xs text-muted">Active job schedules, agreed prices, and completion reviews.</p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-8 text-muted text-sm">
            No bookings active yet. Browse nearby specialists to schedule your first visit!
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking No & Service</th>
                  <th>Professional</th>
                  <th>Agreed Price</th>
                  <th>Scheduled Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div className="font-bold text-sm text-secondary">{b.bookingNumber}</div>
                      <div className="text-xs text-muted">{b.serviceTitle}</div>
                    </td>
                    <td>
                      <div className="font-semibold text-sm">{b.professionalName}</div>
                      <div className="text-xs text-primary">{b.professionalCategoryTitle}</div>
                      <div className="text-xs text-muted">{b.professionalPhone}</div>
                    </td>
                    <td>
                      <div className="font-bold text-sm text-secondary">
                        ₹{b.agreedPrice?.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted">{b.pricingUnit}</div>
                    </td>
                    <td>
                      <div className="text-xs font-semibold">{b.scheduledDate || 'Flexible'}</div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          b.status === 'COMPLETED'
                            ? 'badge-green'
                            : b.status === 'IN_PROGRESS'
                            ? 'badge-blue'
                            : b.status === 'CANCELLED'
                            ? 'badge-red'
                            : 'badge-amber'
                        } text-xs`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {b.status === 'COMPLETED' ? (
                        b.hasReview ? (
                          <div className="flex items-center gap-1 text-xs text-success font-semibold">
                            <Star size={12} fill="#10b981" /> Reviewed ({b.reviewRating}★)
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setReviewBooking(b);
                              setReviewRating(5);
                              setReviewComment('');
                            }}
                            className="btn btn-outline-primary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            ★ Leave Review
                          </button>
                        )
                      ) : b.status !== 'CANCELLED' ? (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="btn btn-outline btn-sm text-danger"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-xs text-muted">Cancelled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewBooking && (
        <div className="modal-overlay" onClick={() => setReviewBooking(null)}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-base font-bold">Review {reviewBooking.professionalName}</h3>
              <button onClick={() => setReviewBooking(null)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleSubmitReview}>
              <div className="modal-body flex flex-col gap-3">
                <div>
                  <label className="form-label">Star Rating (1 to 5):</label>
                  <StarRating
                    rating={reviewRating}
                    size={24}
                    showNumber={true}
                    interactive={true}
                    onChange={(r) => setReviewRating(r)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Review & Workmanship Feedback:</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe their punctuality, quality of masonry/wiring/design, material efficiency, and overall experience..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="form-textarea"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setReviewBooking(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={submittingReview} className="btn btn-primary">
                  {submittingReview ? 'Posting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Request Modal */}
      <ServiceRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        onSuccess={() => loadDashboardData()}
      />
    </div>
  );
}
