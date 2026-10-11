import React, { useState } from 'react';
import { Link, useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import {
  Hammer,
  HardHat,
  MapPin,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  PlusCircle,
  ShieldCheck,
  Building2,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import LocationPickerModal from './LocationPickerModal';

export default function Navbar() {
  const { user, isAuthenticated, isCustomer, isProfessional, isAdmin, logout, demoLogin } = useAuth();
  const { city, isGpsActive } = useLocation();
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const routerLocation = useRouterLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Nearby Pros', path: '/nearby' },
    { label: 'House Construction', path: '/construction' },
    { label: 'Interior Design', path: '/interior' },
    { label: 'Explore Services', path: '/services' },
    { label: 'About', path: '/about' },
  ];

  const getDashboardPath = () => {
    if (isAdmin) return '/admin';
    if (isProfessional) return '/pro-dashboard';
    return '/customer-dashboard';
  };

  return (
    <>
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        {/* Top Announcement & Location Bar */}
        <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '0.8125rem', padding: '6px 0' }}>
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge badge-amber text-xs" style={{ padding: '2px 8px' }}>
                DIRECT MARKETPLACE
              </span>
              <span className="text-xs text-muted" style={{ color: '#94a3b8' }}>
                Connect with verified local builders, architects, masons & interior designers at zero hidden commissions.
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Active Location Pill */}
              <button
                onClick={() => setLocationModalOpen(true)}
                className="flex items-center gap-1.5"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#f8fafc',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
                title="Change active location"
              >
                <MapPin size={12} className={isGpsActive ? 'text-primary' : ''} />
                <span>{city}</span>
                {isGpsActive && <span style={{ color: '#10b981', marginLeft: '2px' }}>(GPS)</span>}
                <ChevronDown size={11} />
              </button>

              {/* 1-Click Demo Switcher */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowDemoMenu(!showDemoMenu)}
                  style={{
                    background: '#d97706',
                    border: 'none',
                    color: '#ffffff',
                    padding: '3px 9px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  ⚡ Quick Demo Login
                </button>

                {showDemoMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '120%',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                      padding: '8px',
                      zIndex: 100,
                      minWidth: '220px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div className="text-xs font-bold text-muted px-2 py-1">Instant Role Demo:</div>
                    <button
                      onClick={async () => {
                        await demoLogin('CUSTOMER');
                        setShowDemoMenu(false);
                        navigate('/customer-dashboard');
                      }}
                      className="btn btn-outline btn-sm w-full mb-1"
                      style={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                      👤 Customer (Aditi Sharma)
                    </button>
                    <button
                      onClick={async () => {
                        await demoLogin('PROFESSIONAL');
                        setShowDemoMenu(false);
                        navigate('/pro-dashboard');
                      }}
                      className="btn btn-outline btn-sm w-full mb-1"
                      style={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                      🧱 Pro Mason (Rajesh Kumar)
                    </button>
                    <button
                      onClick={async () => {
                        await demoLogin('ADMIN');
                        setShowDemoMenu(false);
                        navigate('/admin');
                      }}
                      className="btn btn-outline btn-sm w-full"
                      style={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                      🛡️ Admin (System Overseer)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="container" style={{ padding: '0.75rem 1.25rem' }}>
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div
                style={{
                  background: 'linear-gradient(135deg, #d97706, #b45309)',
                  color: '#ffffff',
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(217, 119, 6, 0.3)',
                }}
              >
                <HardHat size={24} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>
                    Build<span style={{ color: '#d97706' }}>Near</span>
                  </span>
                  <span className="badge badge-amber text-xs">LOCAL</span>
                </div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#64748b', marginTop: '-2px' }}>
                  Construction & Interior Marketplace
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="flex items-center gap-1" style={{ display: 'none', '@media (min-width: 900px)': { display: 'flex' } }}>
              {navLinks.map((link) => {
                const isActive = routerLocation.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{
                      padding: '0.5rem 0.875rem',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#d97706' : '#334155',
                      borderRadius: '8px',
                      backgroundColor: isActive ? '#fef3c7' : 'transparent',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link to={getDashboardPath()} className="btn btn-outline-primary btn-sm">
                    {isAdmin ? <ShieldCheck size={16} /> : isProfessional ? <Building2 size={16} /> : <User size={16} />}
                    <span>Dashboard</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="btn btn-outline btn-sm"
                    title="Sign Out"
                    style={{ padding: '0.375rem 0.625rem' }}
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/auth?mode=login" className="btn btn-outline btn-sm">
                    Sign In
                  </Link>
                  <Link to="/auth?mode=register" className="btn btn-primary btn-sm">
                    Join BUILDCONNECTION
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="btn btn-outline btn-sm"
                style={{ padding: '6px' }}
                aria-label="Toggle Navigation"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {isMobileMenuOpen && (
            <div
              className="animate-fade-in"
              style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    padding: '0.625rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    color: routerLocation.pathname === link.path ? '#d97706' : '#1e293b',
                    backgroundColor: routerLocation.pathname === link.path ? '#fef3c7' : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  onClick={() => {
                    setLocationModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="btn btn-outline w-full btn-sm flex items-center justify-between"
                  style={{ width: '100%' }}
                >
                  <span className="flex items-center gap-2">
                    <MapPin size={16} /> Area: {city}
                  </span>
                  <span className="text-xs text-primary font-bold">Change</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <LocationPickerModal isOpen={isLocationModalOpen} onClose={() => setLocationModalOpen(false)} />
    </>
  );
}
