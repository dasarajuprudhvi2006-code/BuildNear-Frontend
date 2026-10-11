import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  MapPin,
  Award,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  Calendar,
  DollarSign,
  Briefcase,
  Star,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import apiClient from '../api/apiClient';
import { useLocation } from '../context/LocationContext';
import StarRating from '../components/StarRating';
import EstimateBadge from '../components/EstimateBadge';
import DirectBookingModal from '../components/DirectBookingModal';
import ServiceRequestModal from '../components/ServiceRequestModal';

export default function ProfessionalProfilePage() {
  const { id } = useParams();
  const { lat, lng } = useLocation();

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [isRequestModalOpen, setRequestModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfileAndReviews = async () => {
      try {
        setLoading(true);
        const [profRes, revRes] = await Promise.all([
          apiClient.get(`/professionals/${id}?lat=${lat}&lng=${lng}`),
          apiClient.get(`/reviews/professional/${id}`),
        ]);

        if (profRes.success) {
          setProfile(profRes.data);
        }
        if (revRes.success) {
          setReviews(revRes.data);
        }
      } catch (err) {
        console.error('Error fetching professional profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndReviews();
  }, [id, lat, lng]);

  if (loading) {
    return <div className="container py-24 text-center text-muted">Loading professional portfolio...</div>;
  }

  if (!profile) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-xl font-bold mb-2">Professional Profile Not Found</h2>
        <Link to="/nearby" className="btn btn-primary btn-sm">
          Browse Nearby Tradespeople
        </Link>
      </div>
    );
  }

  const formatPricingUnit = (unit) => {
    switch (unit) {
      case 'PER_SQFT': return '/ sq.ft';
      case 'PER_HOUR': return '/ hr';
      case 'PER_DAY': return '/ day';
      case 'PER_PROJECT': return '/ project';
      default: return '/ day';
    }
  };

  const skillsList = profile.skills
    ? profile.skills.split(',').map((s) => s.trim())
    : [];

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Back button */}
      <Link to="/nearby" className="text-xs font-bold text-muted hover:text-primary flex items-center gap-1 mb-4">
        <ArrowLeft size={14} /> Back to Nearby Search
      </Link>

      {/* Main Profile Header Card */}
      <div className="card mb-6" style={{ padding: '2rem' }}>
        <div className="flex items-start justify-between flex-wrap gap-6">
          <div className="flex items-start gap-5">
            <div style={{ position: 'relative' }}>
              <img
                src={
                  profile.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=d97706&color=fff&size=160`
                }
                alt={profile.fullName}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                  border: '3px solid #e2e8f0',
                }}
              />
              {profile.verifiedByAdmin && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-6px',
                    right: '-6px',
                    background: '#10b981',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  }}
                  title="Admin Verified"
                >
                  <ShieldCheck size={16} />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-extrabold text-secondary">{profile.fullName}</h1>
                <span className={`badge ${profile.availability === 'AVAILABLE' ? 'badge-green' : 'badge-amber'}`}>
                  {profile.availability === 'AVAILABLE' ? 'Available for New Jobs' : 'Currently Busy'}
                </span>
                {profile.verifiedByAdmin && (
                  <span className="badge badge-blue">
                    <ShieldCheck size={12} /> Verified Tradesman
                  </span>
                )}
              </div>

              <div className="text-sm font-bold text-primary mt-1">
                {profile.categoryTitle || profile.category}
              </div>

              <div className="flex items-center gap-4 mt-2 text-xs text-muted flex-wrap">
                <div className="flex items-center gap-1 font-semibold">
                  <StarRating rating={profile.averageRating || 0} size={15} count={profile.reviewCount || 0} />
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin size={14} className="text-primary" />
                  <span>{profile.city}</span>
                  {profile.distanceKm !== null && profile.distanceKm !== undefined && (
                    <strong className="text-primary">({profile.distanceKm} km away)</strong>
                  )}
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Award size={14} />
                  <span>{profile.experienceYears}+ Years in Trade</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & CTA Card */}
          <div
            style={{
              background: '#f8fafc',
              padding: '1.25rem 1.5rem',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              textAlign: 'right',
              minWidth: '240px',
            }}
          >
            <div className="text-xs text-muted flex items-center justify-end gap-1 mb-1">
              Minimum Starting Rate <EstimateBadge text="Est." size="xs" />
            </div>
            <div className="font-extrabold text-2xl text-secondary mb-1">
              ₹{profile.minimumPrice?.toLocaleString()}
              <span className="text-xs text-muted font-normal ml-1">{formatPricingUnit(profile.pricingUnit)}</span>
            </div>
            <div className="text-xs text-muted mb-3">Service Radius: {profile.serviceRadiusKm} km</div>

            <div className="flex flex-col gap-2">
              <button onClick={() => setBookingModalOpen(true)} className="btn btn-primary btn-sm">
                Book Site Visit
              </button>
              <button onClick={() => setRequestModalOpen(true)} className="btn btn-outline btn-sm">
                Request Custom Quotation
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column: Bio, Qualifications, Skills */}
        <div style={{ gridColumn: 'span 2' }} className="flex flex-col gap-6">
          {/* About / Bio */}
          <div className="card">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Briefcase size={18} className="text-primary" />
              <span>About & Trade Experience</span>
            </h2>
            <p className="text-sm text-muted" style={{ lineHeight: 1.7 }}>
              {profile.bio}
            </p>

            {profile.qualifications && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="text-xs font-bold text-secondary mb-1">Trade Credentials & Certifications:</div>
                <div className="text-xs text-muted font-medium flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-success" />
                  <span>{profile.qualifications}</span>
                </div>
              </div>
            )}
          </div>

          {/* Skills / Specializations */}
          <div className="card">
            <h2 className="text-lg font-bold mb-3">Specializations & Techniques</h2>
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill, idx) => (
                <span key={idx} className="badge badge-amber text-xs" style={{ padding: '6px 12px' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio Projects */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Featured Completed Projects</h2>
              <span className="text-xs text-muted font-semibold">{profile.portfolioItems?.length || 0} Projects</span>
            </div>

            {profile.portfolioItems && profile.portfolioItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {profile.portfolioItems.map((item) => (
                  <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '1rem' }}>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="font-bold text-sm text-secondary">{item.title}</h4>
                        {item.completedYear && (
                          <span className="badge badge-slate text-xs">{item.completedYear}</span>
                        )}
                      </div>
                      <div className="text-xs text-primary font-semibold mb-2">{item.projectType} • {item.location}</div>
                      <p className="text-xs text-muted" style={{ lineHeight: 1.5 }}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted text-sm">
                No gallery projects uploaded yet.
              </div>
            )}
          </div>

          {/* Customer Reviews */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" />
                <span>Customer Reviews & Ratings ({reviews.length})</span>
              </h2>
            </div>

            {reviews.length > 0 ? (
              <div className="flex flex-col gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="font-bold text-sm text-secondary">{rev.customerName}</div>
                      <StarRating rating={rev.rating} size={13} showNumber={false} />
                    </div>
                    <p className="text-xs text-muted" style={{ lineHeight: 1.5 }}>
                      "{rev.comment}"
                    </p>
                    {rev.professionalResponse && (
                      <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', marginTop: '8px', borderLeft: '3px solid #d97706' }}>
                        <div className="text-xs font-bold text-secondary mb-0.5">{profile.fullName} responded:</div>
                        <div className="text-xs text-muted">{rev.professionalResponse}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted text-sm">
                No reviews yet for this professional.
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Contact & Direct Work Information */}
        <div style={{ gridColumn: 'span 1' }} className="flex flex-col gap-4">
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 className="font-bold text-sm mb-3">Direct Work Contact</h3>
            <div className="flex flex-col gap-2.5 text-xs text-muted mb-4">
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-primary" />
                <span>{profile.phone || '+91 Direct Phone Available'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-primary" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-primary" />
                <span>{profile.address}, {profile.city}</span>
              </div>
            </div>

            <button onClick={() => setBookingModalOpen(true)} className="btn btn-primary w-full btn-sm mb-2" style={{ width: '100%' }}>
              Book Service Visit
            </button>
            <button onClick={() => setRequestModalOpen(true)} className="btn btn-outline w-full btn-sm" style={{ width: '100%' }}>
              Submit Request for Quote
            </button>
          </div>

          <div className="card" style={{ background: '#fffbeb', borderColor: '#fde68a', padding: '1.25rem' }}>
            <h4 className="font-bold text-xs text-amber-900 mb-1">Pricing Guarantee</h4>
            <p className="text-xs text-amber-800" style={{ lineHeight: 1.5 }}>
              BUILDCONNECTION displays transparent starting rates based on regional standards. All actual quotes itemize materials and labor clearly.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DirectBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        professional={profile}
        onSuccess={() => alert('Booking created!')}
      />

      <ServiceRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        targetProfessional={profile}
        onSuccess={() => alert('Quotation request submitted!')}
      />
    </div>
  );
}
