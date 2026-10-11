import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Building2,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Star,
  Trash2
} from 'lucide-react';
import apiClient from '../api/apiClient';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('VERIFICATION'); // VERIFICATION, USERS, BOOKINGS, REVIEWS

  const [professionals, setProfessionals] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, prosRes, usersRes, booksRes, revsRes] = await Promise.all([
        apiClient.get('/admin/stats'),
        apiClient.get('/admin/professionals'),
        apiClient.get('/admin/users'),
        apiClient.get('/admin/bookings'),
        apiClient.get('/admin/reviews'),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (prosRes.success) setProfessionals(prosRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (booksRes.success) setBookings(booksRes.data);
      if (revsRes.success) setReviews(revsRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerifyProfessional = async (profId, newVerifiedStatus) => {
    try {
      const res = await apiClient.patch(`/admin/professionals/${profId}/verify`, { verified: newVerifiedStatus });
      if (res.success) {
        setProfessionals((prev) =>
          prev.map((p) => (p.id === profId ? { ...p, verifiedByAdmin: newVerifiedStatus } : p))
        );
        // Refresh stats
        const statsRes = await apiClient.get('/admin/stats');
        if (statsRes.success) setStats(statsRes.data);
      }
    } catch (err) {
      alert(err.message || 'Failed to update verification status');
    }
  };

  const handleToggleUser = async (userId) => {
    try {
      const res = await apiClient.patch(`/admin/users/${userId}/toggle-status`);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, active: res.data.active } : u))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle user status');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review from the platform?')) return;
    try {
      const res = await apiClient.delete(`/admin/reviews/${reviewId}`);
      if (res.success) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      }
    } catch (err) {
      alert(err.message || 'Failed to delete review');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="badge badge-amber text-xs mb-1">ADMIN CONTROL PORTAL</div>
          <h1 className="text-2xl font-bold">Platform Administration & Quality Control</h1>
          <p className="text-xs text-muted">
            Verify tradesperson credentials, manage accounts, audit platform bookings, and moderate reviews.
          </p>
        </div>
      </div>

      {/* KPI Stats Strip */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="card" style={{ padding: '1rem' }}>
            <div className="text-xs text-muted font-medium">Total Registered Users</div>
            <div className="text-2xl font-extrabold text-secondary mt-1">{stats.totalUsers}</div>
            <div className="text-xs text-muted mt-1">
              {stats.totalCustomers} Customers • {stats.totalProfessionals} Pros
            </div>
          </div>

          <div className="card" style={{ padding: '1rem' }}>
            <div className="text-xs text-muted font-medium">Verified Professionals</div>
            <div className="text-2xl font-extrabold text-success mt-1">{stats.verifiedProfessionals}</div>
            <div className="text-xs text-warning mt-1 font-bold">
              {stats.pendingVerifications} Pending Verification
            </div>
          </div>

          <div className="card" style={{ padding: '1rem' }}>
            <div className="text-xs text-muted font-medium">Platform Bookings</div>
            <div className="text-2xl font-extrabold text-primary mt-1">{stats.totalBookings}</div>
            <div className="text-xs text-muted mt-1">
              {stats.activeBookings} Active • {stats.completedBookings} Completed
            </div>
          </div>

          <div className="card" style={{ padding: '1rem' }}>
            <div className="text-xs text-muted font-medium">Transaction Volume</div>
            <div className="text-2xl font-extrabold text-secondary mt-1">
              ₹{stats.totalTransactionVolume?.toLocaleString()}
            </div>
            <div className="text-xs text-muted mt-1">Platform Avg Rating: {stats.averagePlatformRating}★</div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('VERIFICATION')}
          className={`btn btn-sm ${activeTab === 'VERIFICATION' ? 'btn-primary' : 'btn-outline'}`}
        >
          <ShieldCheck size={15} />
          <span>Professional Verification ({professionals.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('USERS')}
          className={`btn btn-sm ${activeTab === 'USERS' ? 'btn-primary' : 'btn-outline'}`}
        >
          <Users size={15} />
          <span>User Accounts ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('BOOKINGS')}
          className={`btn btn-sm ${activeTab === 'BOOKINGS' ? 'btn-primary' : 'btn-outline'}`}
        >
          <Calendar size={15} />
          <span>All Bookings ({bookings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('REVIEWS')}
          className={`btn btn-sm ${activeTab === 'REVIEWS' ? 'btn-primary' : 'btn-outline'}`}
        >
          <MessageSquare size={15} />
          <span>Reviews Moderation ({reviews.length})</span>
        </button>
      </div>

      {/* Tab 1: Professional Verification */}
      {activeTab === 'VERIFICATION' && (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Professional</th>
                  <th>Trade & Headline</th>
                  <th>Credentials & Qualifications</th>
                  <th>Starting Rate</th>
                  <th>Rating</th>
                  <th>Verification Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {professionals.map((pro) => (
                  <tr key={pro.id}>
                    <td>
                      <div className="font-bold text-sm text-secondary">{pro.fullName}</div>
                      <div className="text-xs text-muted">{pro.city} • {pro.phone}</div>
                    </td>
                    <td>
                      <span className="badge badge-amber text-xs mb-1">{pro.category}</span>
                      <div className="text-xs text-secondary font-medium">{pro.categoryTitle}</div>
                    </td>
                    <td>
                      <div className="text-xs text-muted max-w-xs">{pro.qualifications || 'Self-Declared Tradesman'}</div>
                      <div className="text-xs text-secondary font-semibold">{pro.experienceYears}+ Yrs Exp</div>
                    </td>
                    <td>
                      <div className="font-bold text-xs text-primary">₹{pro.minimumPrice} / {pro.pricingUnit?.replace('PER_', '').toLowerCase()}</div>
                    </td>
                    <td>
                      <div className="text-xs font-semibold">{pro.averageRating}★ ({pro.reviewCount})</div>
                    </td>
                    <td>
                      <span className={`badge ${pro.verifiedByAdmin ? 'badge-green' : 'badge-amber'} text-xs`}>
                        {pro.verifiedByAdmin ? 'Verified Badge' : 'Unverified'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleVerifyProfessional(pro.id, !pro.verifiedByAdmin)}
                        className={`btn btn-sm ${pro.verifiedByAdmin ? 'btn-outline text-danger' : 'btn-primary'}`}
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      >
                        {pro.verifiedByAdmin ? 'Revoke Verification' : 'Verify Specialist'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: User Accounts */}
      {activeTab === 'USERS' && (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>User Full Name</th>
                  <th>Email Address</th>
                  <th>Role</th>
                  <th>City</th>
                  <th>Phone</th>
                  <th>Account Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="font-bold text-sm text-secondary">{u.fullName}</td>
                    <td className="text-xs text-muted">{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'badge-red' : u.role === 'ROLE_PROFESSIONAL' ? 'badge-amber' : 'badge-blue'} text-xs`}>
                        {u.role?.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td className="text-xs text-secondary">{u.city || 'Not specified'}</td>
                    <td className="text-xs text-muted">{u.phone || 'N/A'}</td>
                    <td>
                      <span className={`badge ${u.active ? 'badge-green' : 'badge-red'} text-xs`}>
                        {u.active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td>
                      {u.role !== 'ROLE_ADMIN' && (
                        <button
                          onClick={() => handleToggleUser(u.id)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                          {u.active ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: All Bookings */}
      {activeTab === 'BOOKINGS' && (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking No</th>
                  <th>Customer</th>
                  <th>Professional</th>
                  <th>Service Title</th>
                  <th>Price</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="font-bold text-sm text-secondary">{b.bookingNumber}</td>
                    <td>
                      <div className="text-sm font-semibold">{b.customerName}</div>
                      <div className="text-xs text-muted">{b.customerPhone}</div>
                    </td>
                    <td>
                      <div className="text-sm font-semibold">{b.professionalName}</div>
                      <div className="text-xs text-primary">{b.professionalCategory}</div>
                    </td>
                    <td className="text-xs text-secondary">{b.serviceTitle}</td>
                    <td className="text-sm font-bold text-primary">₹{b.agreedPrice?.toLocaleString()}</td>
                    <td className="text-xs text-muted">{b.scheduledDate || 'Flexible'}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Reviews Moderation */}
      {activeTab === 'REVIEWS' && (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Professional</th>
                  <th>Rating</th>
                  <th>Review Feedback</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td className="font-bold text-sm text-secondary">{r.customerName}</td>
                    <td className="text-xs font-semibold text-primary">{r.professionalName}</td>
                    <td>
                      <span className="text-xs font-bold text-amber-600">{r.rating} / 5 ★</span>
                    </td>
                    <td className="text-xs text-muted max-w-sm">"{r.comment}"</td>
                    <td className="text-xs text-muted">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        className="btn btn-outline btn-sm text-danger"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
