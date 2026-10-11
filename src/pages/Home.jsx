import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ShieldCheck,
  HardHat,
  Compass,
  ArrowRight,
  Sparkles,
  Calculator,
  CheckCircle2,
  Users,
  Award,
  Clock,
  Building,
  Hammer,
  Paintbrush,
  Zap,
  Wrench,
  PenTool,
  Home as HomeIcon
} from 'lucide-react';
import apiClient from '../api/apiClient';
import { useLocation } from '../context/LocationContext';
import ProfessionalCard from '../components/ProfessionalCard';
import EstimateBadge from '../components/EstimateBadge';
import ServiceRequestModal from '../components/ServiceRequestModal';
import DirectBookingModal from '../components/DirectBookingModal';

export default function Home() {
  const navigate = useNavigate();
  const { city, lat, lng, isGpsActive } = useLocation();

  const [featuredPros, setFeaturedPros] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Bar State
  const [searchCategory, setSearchCategory] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Modals
  const [isRequestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedProForBooking, setSelectedProForBooking] = useState(null);
  const [selectedProForQuote, setSelectedProForQuote] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prosRes, pkgRes] = await Promise.all([
          apiClient.get(`/professionals?lat=${lat}&lng=${lng}&sortBy=rating_desc`),
          apiClient.get('/packages/popular'),
        ]);

        if (prosRes.success) {
          setFeaturedPros(prosRes.data.slice(0, 6));
        }
        if (pkgRes.success) {
          setPackages(pkgRes.data);
        }
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lat, lng]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchCategory && searchCategory !== 'ALL') query.set('category', searchCategory);
    if (searchKeyword.trim()) query.set('search', searchKeyword.trim());
    navigate(`/nearby?${query.toString()}`);
  };

  const tradeCategories = [
    { id: 'MASON', label: 'Masons & Brickwork', icon: Hammer, rate: '₹850 / day' },
    { id: 'CIVIL_ENGINEER', label: 'Civil Engineers', icon: Building, rate: '₹1,850 / sq.ft' },
    { id: 'ARCHITECT', label: 'Architects & 3D', icon: PenTool, rate: '₹15 / sq.ft' },
    { id: 'INTERIOR_DESIGNER', label: 'Interior Designers', icon: Sparkles, rate: '₹35,000 / project' },
    { id: 'ELECTRICIAN', label: 'Electricians & Linemen', icon: Zap, rate: '₹450 / day' },
    { id: 'PLUMBER', label: 'Plumbers & Sanitary', icon: Wrench, rate: '₹400 / day' },
    { id: 'CARPENTER', label: 'Carpenters & Modular', icon: HomeIcon, rate: '₹800 / day' },
    { id: 'PAINTER', label: 'Painters & Waterproofing', icon: Paintbrush, rate: '₹18 / sq.ft' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
          paddingTop: '3.5rem',
          paddingBottom: '4.5rem',
          borderBottom: '1px solid #e2e8f0',
          position: 'relative',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <div className="badge badge-amber text-xs mb-3 animate-fade-in" style={{ padding: '6px 14px' }}>
              🏗️ Local Construction & Interior Services Marketplace
            </div>

            <h1
              className="text-4xl font-extrabold mb-4"
              style={{ fontSize: '2.75rem', letterSpacing: '-0.025em', color: '#0f172a' }}
            >
              Hire Trusted Construction & Interior Specialists in <span style={{ color: '#d97706' }}>{city}</span>
            </h1>

            <p className="text-lg text-muted mb-6" style={{ lineHeight: 1.6 }}>
              Compare baseline starting rates, check council qualifications and customer reviews, and receive competitive quotes from verified masons, architects, civil engineers, and turnkey builders.
            </p>

            {/* Interactive Search Card */}
            <div
              className="card"
              style={{
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
                border: '1px solid #cbd5e1',
                padding: '1.25rem',
                borderRadius: '18px',
              }}
            >
              <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 border rounded px-3 py-2" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
                    <HardHat size={18} className="text-primary flex-shrink-0" />
                    <select
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '0.875rem', fontWeight: 500 }}
                    >
                      <option value="ALL">All Construction Trades</option>
                      <option value="MASON">Master Masons & Brickwork</option>
                      <option value="CIVIL_ENGINEER">Civil Engineers & Structural</option>
                      <option value="ARCHITECT">Architects & 3D Elevation</option>
                      <option value="BUILDER_CONTRACTOR">Turnkey Builders / Contractors</option>
                      <option value="INTERIOR_DESIGNER">Interior Designers & Modular</option>
                      <option value="ELECTRICIAN">Licensed Electricians</option>
                      <option value="PLUMBER">Plumbers & Sanitary</option>
                      <option value="CARPENTER">Carpenters & Woodwork</option>
                      <option value="PAINTER">Painters & Waterproofing</option>
                      <option value="DAILY_WAGE_WORKER">Daily-Wage Construction Labor</option>
                      <option value="WELDER">Welders & Steel Grills</option>
                      <option value="LINEMAN">Linemen & Power Technicians</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 border rounded px-3 py-2" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
                    <Search size={18} className="text-muted flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Keyword: e.g. RCC slab, modular kitchen, tile laying..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '0.9375rem' }}>
                  <Search size={16} />
                  <span>Find Nearby Pros</span>
                </button>
              </form>

              <div className="flex items-center justify-between mt-3 text-xs text-muted flex-wrap gap-2 pt-2" style={{ borderTop: '1px solid #f1f5f9' }}>
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin size={13} className="text-primary" /> Active Search Center: <strong>{city}</strong>
                  {isGpsActive && <span className="badge badge-green text-xs" style={{ padding: '1px 6px' }}>GPS Locked</span>}
                </span>

                <div className="flex items-center gap-3">
                  <Link to="/nearby" className="text-primary font-semibold hover:underline">
                    Radius Map & Filters →
                  </Link>
                  <button
                    type="button"
                    onClick={() => setRequestModalOpen(true)}
                    className="text-primary font-bold hover:underline"
                  >
                    + Post Custom Work Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trade Category Quick Grid */}
      <section className="container" style={{ marginTop: '-2.5rem', position: 'relative', zIndex: 10 }}>
        <div className="grid grid-cols-4 gap-3">
          {tradeCategories.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={`/nearby?category=${item.id}`}
                className="card card-hover flex items-center gap-3"
                style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#ffffff' }}
              >
                <div
                  style={{
                    background: '#fef3c7',
                    color: '#d97706',
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm text-secondary">{item.label}</div>
                  <div className="text-xs text-muted flex items-center gap-1">
                    From {item.rate} <EstimateBadge text="Est." size="xs" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Key Stats Counter Bar */}
      <section style={{ padding: '3.5rem 0', borderBottom: '1px solid #e2e8f0', background: '#ffffff', marginTop: '3.5rem' }}>
        <div className="container">
          <div className="grid grid-cols-4 gap-6 text-center">
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>100% Direct</div>
              <div className="text-sm text-muted font-medium mt-1">Zero Brokerage Margins</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706' }}>50+ Trades</div>
              <div className="text-sm text-muted font-medium mt-1">From Foundation to Modular Interior</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>Verified Pros</div>
              <div className="text-sm text-muted font-medium mt-1">Council & Trade Credential Checks</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb' }}>Compare Quotes</div>
              <div className="text-sm text-muted font-medium mt-1">Side-by-Side Scope & Warranty</div>
            </div>
          </div>
        </div>
      </section>

      {/* House Construction & Interior Modules Showcase */}
      <section style={{ padding: '4.5rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <span className="badge badge-amber text-xs mb-2">CATALOG PACKAGES</span>
              <h2 className="text-3xl font-extrabold">Turnkey Construction & Interior Packages</h2>
              <p className="text-sm text-muted mt-1">Transparent estimated price standards with itemized material specifications.</p>
            </div>

            <div className="flex gap-2">
              <Link to="/construction" className="btn btn-outline btn-sm">
                House Construction Module →
              </Link>
              <Link to="/interior" className="btn btn-outline btn-sm">
                Interior Design Module →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="card card-hover flex flex-col justify-between" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '180px' }}>
                  <img
                    src={pkg.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'}
                    alt={pkg.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {pkg.badgeText && (
                    <span
                      className="badge badge-amber"
                      style={{ position: 'absolute', top: '12px', right: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                    >
                      {pkg.badgeText}
                    </span>
                  )}
                  <span
                    className="badge badge-slate text-xs"
                    style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(15,23,42,0.85)', color: '#fff', border: 'none' }}
                  >
                    {pkg.category?.replace('_', ' ')}
                  </span>
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 className="font-bold text-base mb-2" style={{ color: '#0f172a' }}>{pkg.title}</h3>
                    <p className="text-xs text-muted mb-3" style={{ lineHeight: 1.5 }}>{pkg.shortDescription}</p>

                    <div className="flex flex-col gap-1.5 mb-4">
                      {pkg.features &&
                        pkg.features.split('||').slice(0, 3).map((feat, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-muted">
                            <CheckCircle2 size={13} className="text-success flex-shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.875rem' }} className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted flex items-center gap-1">
                        Starting from <EstimateBadge text="Est." size="xs" />
                      </div>
                      <div className="font-extrabold text-lg text-primary">
                        ₹{pkg.startingPrice?.toLocaleString()} <span className="text-xs text-muted font-normal">/ {pkg.pricingUnit}</span>
                      </div>
                    </div>

                    <Link
                      to={pkg.category === 'HOUSE_CONSTRUCTION' ? '/construction' : '/interior'}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Explore Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Verified Specialists in surrounding area */}
      <section style={{ padding: '4.5rem 0', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <span className="badge badge-green text-xs mb-2">VERIFIED LOCAL TRADES</span>
              <h2 className="text-3xl font-extrabold">Top Construction Professionals in {city}</h2>
              <p className="text-sm text-muted mt-1">Sorted by rating and proximity. Direct contacts, reviews, and starting rates.</p>
            </div>

            <Link to="/nearby" className="btn btn-primary btn-sm">
              View All Nearby Specialists ({featuredPros.length}+) →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted">Loading verified local specialists...</div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {featuredPros.map((pro) => (
                <ProfessionalCard
                  key={pro.id}
                  professional={pro}
                  onDirectBook={(p) => setSelectedProForBooking(p)}
                  onRequestQuote={(p) => setSelectedProForQuote(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How BUILDCONNECTION Works Section */}
      <section style={{ padding: '4.5rem 0', background: '#0f172a', color: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-amber text-xs mb-2">WORKFLOW</span>
            <h2 className="text-3xl font-extrabold" style={{ color: '#ffffff' }}>
              How BUILDCONNECTION Protects Your Construction Project
            </h2>
            <p className="text-sm text-muted" style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
              From initial blueprint estimation to finalized handover — straightforward, transparent, and verified.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="card" style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}>
              <div
                style={{
                  background: '#d97706',
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '1rem',
                }}
              >
                1
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#ffffff' }}>Search or Estimate</h3>
              <p className="text-sm text-muted" style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                Use our GPS radar to find specialists in your radius, or calculate instant budget breakdowns using our House Construction and Interior Design cost estimators.
              </p>
            </div>

            <div className="card" style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}>
              <div
                style={{
                  background: '#10b981',
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '1rem',
                }}
              >
                2
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#ffffff' }}>Compare Side-by-Side</h3>
              <p className="text-sm text-muted" style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                Post your job to receive multiple detailed quotations. Compare labor vs material costs, completion timelines, and warranties before accepting.
              </p>
            </div>

            <div className="card" style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}>
              <div
                style={{
                  background: '#2563eb',
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '1rem',
                }}
              >
                3
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#ffffff' }}>Hire & Review</h3>
              <p className="text-sm text-muted" style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                Track milestone progress directly on your customer dashboard. Once the work is successfully executed, submit your verified review for the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{ padding: '4rem 0', background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', color: '#ffffff' }}>
        <div className="container flex items-center justify-between flex-wrap gap-6">
          <div style={{ maxWidth: '600px' }}>
            <h2 className="text-3xl font-extrabold mb-2" style={{ color: '#ffffff' }}>Ready to Start Your Construction or Interior Project?</h2>
            <p className="text-sm" style={{ opacity: 0.9 }}>
              Post your service request today to receive tailored competitive quotes from local verified tradespeople in {city}.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setRequestModalOpen(true)}
              className="btn btn-secondary btn-lg"
              style={{ backgroundColor: '#0f172a', borderColor: '#0f172a' }}
            >
              Post Service Request
            </button>
            <Link to="/nearby" className="btn btn-outline btn-lg" style={{ borderColor: '#ffffff', color: '#ffffff' }}>
              Browse Tradespeople
            </Link>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ServiceRequestModal
        isOpen={isRequestModalOpen || !!selectedProForQuote}
        onClose={() => {
          setRequestModalOpen(false);
          setSelectedProForQuote(null);
        }}
        targetProfessional={selectedProForQuote}
        onSuccess={() => navigate('/customer-dashboard')}
      />

      <DirectBookingModal
        isOpen={!!selectedProForBooking}
        onClose={() => setSelectedProForBooking(null)}
        professional={selectedProForBooking}
        onSuccess={() => navigate('/customer-dashboard')}
      />
    </div>
  );
}
