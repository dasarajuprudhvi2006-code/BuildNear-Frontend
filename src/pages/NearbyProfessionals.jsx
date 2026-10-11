import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  SlidersHorizontal,
  Search,
  CheckCircle,
  AlertCircle,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Compass
} from 'lucide-react';
import apiClient from '../api/apiClient';
import { useLocation } from '../context/LocationContext';
import ProfessionalCard from '../components/ProfessionalCard';
import DirectBookingModal from '../components/DirectBookingModal';
import ServiceRequestModal from '../components/ServiceRequestModal';

export default function NearbyProfessionals() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { city, lat, lng, radiusKm, setRadiusKm, isGpsActive, gpsError, detectingGps, detectGps, setManualCity, availableCities } = useLocation();

  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [category, setCategory] = useState(searchParams.get('category') || 'ALL');
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || (lat && lng ? 'distance_asc' : 'rating_desc'));
  const [minRating, setMinRating] = useState('');
  const [minExperience, setMinExperience] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Modals State
  const [selectedProForBooking, setSelectedProForBooking] = useState(null);
  const [selectedProForQuote, setSelectedProForQuote] = useState(null);

  const fetchProfessionals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (lat) params.set('lat', lat);
      if (lng) params.set('lng', lng);
      if (radiusKm && radiusKm > 0) params.set('radius', radiusKm);
      if (category && category !== 'ALL') params.set('category', category);
      if (searchKeyword.trim()) params.set('search', searchKeyword.trim());
      if (sortBy) params.set('sortBy', sortBy);
      if (minRating) params.set('minRating', minRating);
      if (minExperience) params.set('minExperience', minExperience);
      if (maxPrice) params.set('maxPrice', maxPrice);

      const res = await apiClient.get(`/professionals?${params.toString()}`);
      if (res.success) {
        setProfessionals(res.data);
      }
    } catch (err) {
      console.error('Error fetching professionals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, [lat, lng, radiusKm, category, sortBy, minRating, minExperience, maxPrice]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProfessionals();
  };

  const resetFilters = () => {
    setCategory('ALL');
    setSearchKeyword('');
    setSortBy(lat && lng ? 'distance_asc' : 'rating_desc');
    setMinRating('');
    setMinExperience('');
    setMaxPrice('');
    setRadiusKm(25);
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header & Location Radar Banner */}
      <div
        className="card mb-6"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          borderColor: '#334155',
          padding: '1.75rem',
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="badge badge-amber text-xs mb-2">HYPERLOCAL GPS SEARCH</div>
            <h1 className="text-2xl font-bold" style={{ color: '#ffffff' }}>
              Nearby Construction & Interior Professionals
            </h1>
            <p className="text-sm text-muted" style={{ color: '#94a3b8', marginTop: '4px' }}>
              Real-time Haversine distance calculations from your location. Filter by radius, minimum price, and verified trade category.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* GPS Trigger Button */}
            <button
              onClick={detectGps}
              disabled={detectingGps}
              className={`btn ${isGpsActive ? 'btn-primary' : 'btn-outline'}`}
              style={{
                borderColor: isGpsActive ? '#d97706' : '#475569',
                color: '#ffffff',
                backgroundColor: isGpsActive ? '#d97706' : 'rgba(255,255,255,0.05)',
              }}
            >
              <Navigation size={15} className={detectingGps ? 'animate-spin' : ''} />
              <span>{isGpsActive ? 'GPS Active (Locked)' : detectingGps ? 'Detecting...' : 'Use My GPS Location'}</span>
            </button>

            {/* Manual City Dropdown Fallback */}
            <div className="flex items-center gap-1.5" style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 12px', border: '1px solid #475569' }}>
              <MapPin size={15} className="text-primary" />
              <select
                value={availableCities.some((c) => c.name.toLowerCase() === city.toLowerCase()) ? city : 'Mumbai'}
                onChange={(e) => setManualCity(e.target.value)}
                style={{
                  background: 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {availableCities.map((c) => (
                  <option key={c.name} value={c.name} style={{ background: '#0f172a', color: '#fff' }}>
                    {c.name} ({c.region})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {gpsError && (
          <div className="mt-3 text-xs text-amber-300 flex items-center gap-1.5" style={{ color: '#fde68a' }}>
            <AlertCircle size={14} />
            <span>{gpsError}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-6 layout-sidebar-main">
        {/* Sidebar Filters */}
        <div className="sidebar-col" style={{ gridColumn: 'span 1' }}>
          <div className="card" style={{ padding: '1.25rem', position: 'sticky', top: '90px' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-base">
                <SlidersHorizontal size={18} className="text-primary" />
                <span>Filters</span>
              </div>
              <button onClick={resetFilters} className="text-xs text-primary font-bold hover:underline">
                Reset All
              </button>
            </div>

            {/* Radius Filter */}
            <div className="form-group mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="form-label" style={{ marginBottom: 0 }}>Search Radius</label>
                <span className="text-xs font-bold text-primary">{radiusKm} km</span>
              </div>
              <div className="flex gap-1.5">
                {[5, 10, 25, 50].map((km) => (
                  <button
                    key={km}
                    onClick={() => setRadiusKm(km)}
                    className={`btn btn-sm flex-1 ${radiusKm === km ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '4px 6px', fontSize: '0.75rem' }}
                  >
                    {km}km
                  </button>
                ))}
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="form-group mb-4">
              <label className="form-label">Trade Specialist</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                <option value="ALL">All Construction Trades</option>
                <option value="ARCHITECT">Architects & Planners</option>
                <option value="CIVIL_ENGINEER">Civil Engineers & Structural</option>
                <option value="BUILDER_CONTRACTOR">Turnkey Builders / Contractors</option>
                <option value="MASON">Master Masons & Brickwork</option>
                <option value="INTERIOR_DESIGNER">Interior Designers & Modular</option>
                <option value="CARPENTER">Carpenters & Woodwork</option>
                <option value="ELECTRICIAN">Licensed Electricians</option>
                <option value="PLUMBER">Plumbers & Drainage</option>
                <option value="PAINTER">Painters & Waterproofing</option>
                <option value="DAILY_WAGE_WORKER">Daily-Wage Labor Squads</option>
                <option value="WELDER">Welders & Steel Grills</option>
                <option value="LINEMAN">Linemen & High Power</option>
              </select>
            </div>

            {/* Max Budget Filter */}
            <div className="form-group mb-4">
              <label className="form-label">Max Starting Price (₹)</label>
              <input
                type="number"
                placeholder="e.g. 1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Min Rating */}
            <div className="form-group mb-4">
              <label className="form-label">Minimum Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="form-select"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars ★★★★★</option>
                <option value="4.0">4.0+ Stars ★★★★☆</option>
                <option value="3.5">3.5+ Stars ★★★☆☆</option>
              </select>
            </div>

            {/* Min Experience */}
            <div className="form-group mb-4">
              <label className="form-label">Minimum Experience</label>
              <select
                value={minExperience}
                onChange={(e) => setMinExperience(e.target.value)}
                className="form-select"
              >
                <option value="">Any Experience</option>
                <option value="5">5+ Years in Trade</option>
                <option value="10">10+ Years in Trade</option>
                <option value="15">15+ Master Veteran</option>
              </select>
            </div>

            <div className="estimate-disclaimer mt-2">
              All displayed pricing represents baseline starting rates. Quotations are customized to exact scope.
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-col" style={{ gridColumn: 'span 3' }}>
          {/* Top Search Bar & Sort selector */}
          <div className="card mb-4" style={{ padding: '1rem 1.25rem' }}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Filter by skill, name or qualification (e.g. Vastu, AAC Block, Hettich, 3-Phase)..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="form-input"
                  style={{ width: '100%' }}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  <Search size={15} />
                </button>
              </form>

              <div className="flex items-center gap-2">
                <ArrowUpDown size={15} className="text-muted" />
                <span className="text-xs font-semibold text-muted">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select"
                  style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', width: 'auto' }}
                >
                  <option value="distance_asc">Nearest Distance (📍 GPS)</option>
                  <option value="price_asc">Lowest Price First (₹)</option>
                  <option value="price_desc">Highest Price First (₹)</option>
                  <option value="rating_desc">Highest Customer Rating (★)</option>
                  <option value="experience_desc">Most Experienced First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-muted">
              {searchKeyword.trim() ? (
                <span>
                  Found <strong className="text-secondary">{professionals.length}</strong> professionals matching{' '}
                  <span className="badge badge-amber text-xs" style={{ verticalAlign: 'middle' }}>
                    "{searchKeyword}"
                  </span>{' '}
                  <span style={{ color: '#d97706' }}>across all regions</span>
                </span>
              ) : (
                <span>
                  Found <strong className="text-secondary">{professionals.length}</strong> professionals within {radiusKm}km of {city}
                </span>
              )}
            </div>
            {searchKeyword.trim() && (
              <button
                onClick={() => { setSearchKeyword(''); }}
                className="btn btn-outline btn-sm text-xs"
                style={{ padding: '4px 10px' }}
              >
                ✕ Clear Search
              </button>
            )}
          </div>

          {/* Professionals Grid */}
          {loading ? (
            <div className="card text-center py-16 text-muted">
              <RefreshCw size={24} className="animate-spin text-primary mb-2 mx-auto" />
              <div>
                {searchKeyword.trim()
                  ? `Searching all regions for "${searchKeyword}"...`
                  : 'Calculating nearest distances and retrieving professionals...'}
              </div>
            </div>
          ) : professionals.length === 0 ? (
            <div className="card text-center py-16">
              <AlertCircle size={36} className="text-muted mx-auto mb-3" />
              <h3 className="text-lg font-bold mb-1">
                {searchKeyword.trim()
                  ? `No professionals found for "${searchKeyword}"`
                  : 'No professionals match your current radius or filters'}
              </h3>
              <p className="text-sm text-muted mb-4">
                {searchKeyword.trim()
                  ? 'Try a different keyword — for example: "plumber", "Vastu", "AAC Block", "3-phase", or a city name like "Jaipur".'
                  : 'Try widening your search radius to 50 km or clearing price and rating constraints.'}
              </p>
              <button onClick={resetFilters} className="btn btn-outline-primary btn-sm">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {professionals.map((pro) => (
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
      </div>

      {/* Modals */}
      <DirectBookingModal
        isOpen={!!selectedProForBooking}
        onClose={() => setSelectedProForBooking(null)}
        professional={selectedProForBooking}
        onSuccess={() => alert('Booking created successfully! Check your customer dashboard.')}
      />

      <ServiceRequestModal
        isOpen={!!selectedProForQuote}
        onClose={() => setSelectedProForQuote(null)}
        targetProfessional={selectedProForQuote}
        onSuccess={() => alert('Quotation request sent!')}
      />
    </div>
  );
}
