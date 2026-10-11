import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  DollarSign,
  Star,
  CheckCircle,
  Clock,
  PlusCircle,
  ShieldCheck,
  Send,
  Trash2,
  Image,
  RefreshCw,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import QuotationModal from '../components/QuotationModal';

export default function ProfessionalDashboard() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [availableRequests, setAvailableRequests] = useState([]);
  const [myQuotations, setMyQuotations] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Availability Toggling
  const [togglingAvailability, setTogglingAvailability] = useState(false);

  // Quote Modal
  const [selectedReqForQuote, setSelectedReqForQuote] = useState(null);

  // Portfolio Item Form
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: '',
    projectType: 'House Construction',
    location: '',
    imageUrl: '',
    completedYear: 2024,
    description: '',
  });
  const [addingPortfolio, setAddingPortfolio] = useState(false);

  // Profile Edit State
  const [profileEdit, setProfileEdit] = useState({
    categoryTitle: '',
    bio: '',
    skills: '',
    minimumPrice: 500,
    pricingUnit: 'PER_DAY',
    serviceRadiusKm: 25,
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profRes, statsRes, reqsRes, quotesRes, booksRes] = await Promise.all([
        apiClient.get('/professionals/me'),
        apiClient.get('/dashboard/stats'),
        apiClient.get('/requests/available'),
        apiClient.get('/quotations/my'),
        apiClient.get('/bookings/my'),
      ]);

      if (profRes.success) {
        setProfile(profRes.data);
        setProfileEdit({
          categoryTitle: profRes.data.categoryTitle || '',
          bio: profRes.data.bio || '',
          skills: profRes.data.skills || '',
          minimumPrice: profRes.data.minimumPrice || 500,
          pricingUnit: profRes.data.pricingUnit || 'PER_DAY',
          serviceRadiusKm: profRes.data.serviceRadiusKm || 25,
        });
      }
      if (statsRes.success) setStats(statsRes.data);
      if (reqsRes.success) setAvailableRequests(reqsRes.data);
      if (quotesRes.success) setMyQuotations(quotesRes.data);
      if (booksRes.success) setMyBookings(booksRes.data);
    } catch (err) {
      console.error('Failed to load professional dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleAvailability = async () => {
    setTogglingAvailability(true);
    try {
      const res = await apiClient.put('/professionals/availability');
      if (res.success) {
        setProfile((prev) => ({ ...prev, availability: res.data.availability }));
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle availability');
    } finally {
      setTogglingAvailability(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    const notes = prompt(`Enter notes for marking job as ${newStatus} (optional):`) || '';
    try {
      const res = await apiClient.patch(`/bookings/${bookingId}/status`, { status: newStatus, notes });
      if (res.success) {
        alert(`Booking status updated to ${newStatus}`);
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to update booking status');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await apiClient.put('/user/profile', profileEdit);
      if (res.success) {
        alert('Profile and rates updated successfully!');
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to save profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    setAddingPortfolio(true);
    try {
      const res = await apiClient.post('/professionals/portfolio', newPortfolioItem);
      if (res.success) {
        alert('Portfolio project added!');
        setNewPortfolioItem({
          title: '',
          projectType: 'House Construction',
          location: '',
          imageUrl: '',
          completedYear: 2024,
          description: '',
        });
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to add portfolio item');
    } finally {
      setAddingPortfolio(false);
    }
  };

  const handleDeletePortfolio = async (itemId) => {
    if (!window.confirm('Delete this project from your portfolio?')) return;
    try {
      const res = await apiClient.delete(`/professionals/portfolio/${itemId}`);
      if (res.success) {
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete portfolio item');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-amber text-xs">PROFESSIONAL PORTAL</span>
            {profile?.verifiedByAdmin ? (
              <span className="badge badge-green text-xs">
                <ShieldCheck size={12} /> Verified Specialist
              </span>
            ) : (
              <span className="badge badge-slate text-xs">Pending Verification</span>
            )}
          </div>
          <h1 className="text-2xl font-bold">{profile?.fullName} • {profile?.categoryTitle}</h1>
          <p className="text-xs text-muted">
            Manage your service area radius, submit bids for nearby open requests, and track job executions.
          </p>
        </div>

        {/* Availability Switch & Public Profile Link */}
        <div className="flex items-center gap-3">
          {profile?.id && (
            <Link
              to={`/professionals/${profile.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm flex items-center gap-1.5"
              style={{ textDecoration: 'none' }}
              title="Preview how customers see your profile"
            >
              <ExternalLink size={14} /> Preview Public Profile
            </Link>
          )}

          <div style={{ textAlign: 'right' }}>
            <div className="text-xs text-muted">Work Status:</div>
            <strong className={`text-xs ${profile?.availability === 'AVAILABLE' ? 'text-success' : 'text-warning'}`}>
              {profile?.availability === 'AVAILABLE' ? 'Accepting Inquiries' : 'Marked Busy'}
            </strong>
          </div>
          <button
            onClick={handleToggleAvailability}
            disabled={togglingAvailability}
            className={`btn btn-sm ${profile?.availability === 'AVAILABLE' ? 'btn-primary' : 'btn-outline'}`}
          >
            {profile?.availability === 'AVAILABLE' ? 'Set as Busy' : 'Set as Available'}
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="card" style={{ padding: '1rem' }}>
          <div className="text-xs text-muted font-medium">Available Local Leads</div>
          <div className="text-2xl font-extrabold text-primary mt-1">{availableRequests.length}</div>
        </div>
        <div className="card" style={{ padding: '1rem' }}>
          <div className="text-xs text-muted font-medium">Quotations Submitted</div>
          <div className="text-2xl font-extrabold text-secondary mt-1">{myQuotations.length}</div>
        </div>
        <div className="card" style={{ padding: '1rem' }}>
          <div className="text-xs text-muted font-medium">Active Bookings</div>
          <div className="text-2xl font-extrabold text-secondary mt-1">
            {myBookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS').length}
          </div>
        </div>
        <div className="card" style={{ padding: '1rem' }}>
          <div className="text-xs text-muted font-medium">Rating & Reviews</div>
          <div className="text-2xl font-extrabold text-success mt-1 flex items-center gap-1">
            <Star size={20} fill="#10b981" /> {profile?.averageRating || 0}
            <span className="text-xs text-muted font-normal">({profile?.reviewCount || 0})</span>
          </div>
        </div>
      </div>

      {/* Section 1: Nearby Open Service Requests Available for Bidding */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Briefcase size={18} className="text-primary" />
              <span>Available Service Requests in {profile?.category} ({availableRequests.length})</span>
            </h2>
            <p className="text-xs text-muted">Submit customized quotations with itemized labor and material costs.</p>
          </div>
        </div>

        {availableRequests.length === 0 ? (
          <div className="text-center py-8 text-muted text-sm">
            No open requests in your trade at this moment. Check back soon!
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title & Client</th>
                  <th>Property & Location</th>
                  <th>Budget</th>
                  <th>Urgency</th>
                  <th>Posted Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {availableRequests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div className="font-bold text-sm text-secondary">{req.title}</div>
                      <div className="text-xs text-muted">Client: {req.customerName}</div>
                    </td>
                    <td>
                      <div className="text-xs text-secondary">{req.propertyType}</div>
                      <div className="text-xs text-muted">{req.address}, {req.city} {req.areaSqFt ? `(${req.areaSqFt} sq.ft)` : ''}</div>
                    </td>
                    <td>
                      <div className="text-xs font-semibold">
                        {req.estimatedBudget ? `₹${req.estimatedBudget.toLocaleString()}` : 'Budget Flexible'}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-slate text-xs">{req.urgency}</span>
                    </td>
                    <td>
                      <div className="text-xs text-muted">{new Date(req.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedReqForQuote(req)}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        <Send size={12} /> Submit Quote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Active Job Bookings Manager */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              <span>Active Bookings & Execution Schedule</span>
            </h2>
            <p className="text-xs text-muted">Track scheduled dates and update execution status for clients.</p>
          </div>
        </div>

        {myBookings.length === 0 ? (
          <div className="text-center py-8 text-muted text-sm">
            No bookings assigned yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking No & Service</th>
                  <th>Customer Details</th>
                  <th>Agreed Price</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Update Job Status</th>
                </tr>
              </thead>
              <tbody>
                {myBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div className="font-bold text-sm text-secondary">{b.bookingNumber}</div>
                      <div className="text-xs text-muted">{b.serviceTitle}</div>
                    </td>
                    <td>
                      <div className="font-semibold text-sm">{b.customerName}</div>
                      <div className="text-xs text-muted">{b.customerPhone}</div>
                      <div className="text-xs text-muted">{b.customerAddress}</div>
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
                      <div className="flex items-center gap-2">
                        {b.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'IN_PROGRESS')}
                            className="btn btn-outline-primary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            ▶ Start Job
                          </button>
                        )}
                        {b.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'COMPLETED')}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            ✓ Mark Completed
                          </button>
                        )}
                        {b.status === 'COMPLETED' && (
                          <span className="text-xs text-success font-semibold">Completed Successfully</span>
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

      {/* Section 3: Profile & Portfolio Management */}
      <div className="grid grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="card">
          <h3 className="font-bold text-base mb-3">Update Trade Profile & Baseline Rates</h3>
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-3">
            <div className="form-group">
              <label className="form-label">Category Title / Display Headline</label>
              <input
                type="text"
                value={profileEdit.categoryTitle}
                onChange={(e) => setProfileEdit({ ...profileEdit, categoryTitle: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="form-label">Minimum Rate (₹)</label>
                <input
                  type="number"
                  value={profileEdit.minimumPrice}
                  onChange={(e) => setProfileEdit({ ...profileEdit, minimumPrice: parseFloat(e.target.value) })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pricing Unit</label>
                <select
                  value={profileEdit.pricingUnit}
                  onChange={(e) => setProfileEdit({ ...profileEdit, pricingUnit: e.target.value })}
                  className="form-select"
                >
                  <option value="PER_DAY">Per Day (Labor/Supervision)</option>
                  <option value="PER_SQFT">Per Sq.Ft (Civil/Tiles/Paint)</option>
                  <option value="PER_HOUR">Per Hour</option>
                  <option value="PER_PROJECT">Per Project (Turnkey/Interior)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Service Radius (km)</label>
              <input
                type="number"
                value={profileEdit.serviceRadiusKm}
                onChange={(e) => setProfileEdit({ ...profileEdit, serviceRadiusKm: parseFloat(e.target.value) })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Specializations / Skills (comma separated)</label>
              <input
                type="text"
                value={profileEdit.skills}
                onChange={(e) => setProfileEdit({ ...profileEdit, skills: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio Description</label>
              <textarea
                rows={3}
                value={profileEdit.bio}
                onChange={(e) => setProfileEdit({ ...profileEdit, bio: e.target.value })}
                className="form-textarea"
              />
            </div>

            <button type="submit" disabled={savingProfile} className="btn btn-primary btn-sm">
              {savingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Portfolio Uploader */}
        <div className="card">
          <h3 className="font-bold text-base mb-3">Add Completed Project to Portfolio</h3>
          <form onSubmit={handleAddPortfolio} className="flex flex-col gap-3">
            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Duplex Villa 3D Elevation or Emerald Kitchen"
                value={newPortfolioItem.title}
                onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, title: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="form-label">Project Type</label>
                <select
                  value={newPortfolioItem.projectType}
                  onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, projectType: e.target.value })}
                  className="form-select"
                >
                  <option value="House Construction">House Construction</option>
                  <option value="Interior Design">Interior Design</option>
                  <option value="Electrical Work">Electrical Work</option>
                  <option value="Plumbing Work">Plumbing Work</option>
                  <option value="Renovation">Renovation</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Location / Neighborhood</label>
                <input
                  type="text"
                  placeholder="e.g. Bandra West"
                  value={newPortfolioItem.location}
                  onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, location: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Project Image URL</label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={newPortfolioItem.imageUrl}
                onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, imageUrl: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Project Description</label>
              <textarea
                rows={2}
                placeholder="Short description of structural or aesthetic work executed..."
                value={newPortfolioItem.description}
                onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, description: e.target.value })}
                className="form-textarea"
              />
            </div>

            <button type="submit" disabled={addingPortfolio} className="btn btn-outline-primary btn-sm">
              <Image size={15} />
              <span>{addingPortfolio ? 'Uploading...' : 'Add Project to Gallery'}</span>
            </button>
          </form>

          {/* Current Portfolio List */}
          {profile?.portfolioItems && profile.portfolioItems.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="text-xs font-bold text-muted mb-2">Current Gallery ({profile.portfolioItems.length}):</div>
              <div className="flex flex-col gap-2">
                {profile.portfolioItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded border">
                    <span className="font-semibold text-secondary truncate max-w-xs">{item.title}</span>
                    <button onClick={() => handleDeletePortfolio(item.id)} className="text-danger hover:underline">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quotation Submission Modal */}
      <QuotationModal
        isOpen={!!selectedReqForQuote}
        onClose={() => setSelectedReqForQuote(null)}
        serviceRequest={selectedReqForQuote}
        onSuccess={() => loadData()}
      />
    </div>
  );
}
