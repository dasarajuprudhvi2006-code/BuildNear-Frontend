import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Star, Clock, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import StarRating from './StarRating';
import EstimateBadge from './EstimateBadge';

export default function ProfessionalCard({ professional, onDirectBook, onRequestQuote }) {
  const formatPricingUnit = (unit) => {
    switch (unit) {
      case 'PER_SQFT':
        return '/ sq.ft';
      case 'PER_HOUR':
        return '/ hr';
      case 'PER_DAY':
        return '/ day';
      case 'PER_PROJECT':
        return '/ project';
      default:
        return '/ day';
    }
  };

  const skillsList = professional.skills
    ? professional.skills.split(',').map((s) => s.trim()).slice(0, 3)
    : [];

  return (
    <div className="card card-hover flex flex-col justify-between" style={{ height: '100%', padding: '1.25rem' }}>
      <div>
        {/* Header: Photo, Name, Verified Badge */}
        <div className="flex items-start gap-3.5 mb-3">
          <div style={{ position: 'relative' }}>
            <img
              src={
                professional.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(professional.fullName || 'Pro')}&background=d97706&color=fff&size=120`
              }
              alt={professional.fullName}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                objectFit: 'cover',
                border: '2px solid #e2e8f0',
              }}
            />
            {professional.verifiedByAdmin && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  background: '#10b981',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                }}
                title="Admin Verified Professional"
              >
                <ShieldCheck size={13} />
              </span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between gap-1">
              <Link to={`/professionals/${professional.id}`} className="font-bold text-base hover:text-primary" style={{ color: '#0f172a' }}>
                {professional.fullName}
              </Link>
              <span className={`badge ${professional.availability === 'AVAILABLE' ? 'badge-green' : 'badge-amber'} text-xs`}>
                {professional.availability === 'AVAILABLE' ? 'Available' : 'Busy'}
              </span>
            </div>

            <div className="text-xs font-semibold text-primary" style={{ marginTop: '2px' }}>
              {professional.categoryTitle || professional.category}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={professional.averageRating || 0} size={14} count={professional.reviewCount || 0} />
            </div>
          </div>
        </div>

        {/* Location & Experience Info */}
        <div className="flex items-center gap-3 text-xs text-muted mb-3" style={{ padding: '6px 10px', background: '#f8fafc', borderRadius: '8px' }}>
          <div className="flex items-center gap-1 font-medium">
            <MapPin size={13} className="text-primary" />
            <span>{professional.city || 'Local Area'}</span>
            {professional.distanceKm !== null && professional.distanceKm !== undefined && (
              <span className="font-bold text-primary ml-1">({professional.distanceKm} km away)</span>
            )}
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Award size={13} />
            <span>{professional.experienceYears || 2}+ Yrs Exp</span>
          </div>
        </div>

        {/* Bio snippet */}
        <p className="text-xs text-muted mb-3" style={{ lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {professional.bio || 'Experienced local construction professional delivering high quality workmanship.'}
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skillsList.map((skill, idx) => (
            <span key={idx} className="badge badge-slate text-xs" style={{ fontSize: '0.7rem', padding: '2px 7px' }}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer: Price Display & Action Buttons */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.875rem' }}>
        <div className="flex items-baseline justify-between mb-2.5">
          <div>
            <div className="text-xs text-muted flex items-center gap-1">
              Starting from <EstimateBadge text="Est." size="xs" />
            </div>
            <div className="flex items-baseline gap-1">
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                ₹{professional.minimumPrice?.toLocaleString()}
              </span>
              <span className="text-xs text-muted">{formatPricingUnit(professional.pricingUnit)}</span>
            </div>
          </div>

          <Link
            to={`/professionals/${professional.id}`}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            View Work <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onDirectBook && onDirectBook(professional)}
            className="btn btn-primary btn-sm"
          >
            Book Visit
          </button>
          <button
            onClick={() => onRequestQuote && onRequestQuote(professional)}
            className="btn btn-outline btn-sm"
          >
            Request Quote
          </button>
        </div>
      </div>
    </div>
  );
}
