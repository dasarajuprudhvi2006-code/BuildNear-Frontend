import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calculator,
  CheckCircle2,
  Clock,
  AlertCircle,
  Home,
  Layers,
  Palette,
  ArrowRight
} from 'lucide-react';
import apiClient from '../api/apiClient';
import EstimateBadge from '../components/EstimateBadge';
import ServiceRequestModal from '../components/ServiceRequestModal';

export default function InteriorDesignPage() {
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  // Estimator Calculator State
  const [homeType, setHomeType] = useState('2BHK');
  const [interiorScope, setInteriorScope] = useState('FULL_HOME');
  const [estimateResult, setEstimateResult] = useState(null);
  const [estimating, setEstimating] = useState(false);

  // Modal
  const [isRequestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedPrefill, setSelectedPrefill] = useState(null);

  const fetchEstimate = async () => {
    try {
      setEstimating(true);
      const res = await apiClient.post('/estimations/interior', {
        homeType,
        interiorScope,
      });
      if (res.success) {
        setEstimateResult(res.data);
      }
    } catch (err) {
      console.error('Failed to calculate interior estimate', err);
    } finally {
      setEstimating(false);
    }
  };

  useEffect(() => {
    fetchEstimate();
  }, [homeType, interiorScope]);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await apiClient.get('/packages?category=INTERIOR_DESIGN');
        if (res.success) {
          setPackages(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPackages(false);
      }
    };
    loadPackages();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }}>
        <span className="badge badge-amber text-xs mb-2">INTERIOR DESIGN MODULE</span>
        <h1 className="text-3xl font-extrabold mb-3">Contemporary Interior Design & Modular Work</h1>
        <p className="text-muted text-base" style={{ lineHeight: 1.6 }}>
          Transform your apartments and villas with customized modular kitchens, floor-to-ceiling wardrobes, designer false ceilings, and ambient lighting by local certified interior stylists.
        </p>
      </div>

      {/* Interactive Interior Design Cost Estimator Calculator */}
      <div className="card mb-8" style={{ border: '2px solid #d97706', padding: '2rem', background: '#ffffff' }}>
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="text-primary" size={24} />
          <h2 className="text-xl font-extrabold text-secondary">Interior Design Cost Estimator</h2>
          <EstimateBadge text="Instant Live Estimate" size="sm" />
        </div>
        <p className="text-xs text-muted mb-6">
          Select your floorplan and required woodwork scope to view an estimated indicative budget with itemized room breakdowns.
        </p>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="form-group">
            <label className="form-label">Floorplan / Home Size</label>
            <select
              value={homeType}
              onChange={(e) => setHomeType(e.target.value)}
              className="form-select"
            >
              <option value="1BHK">1 BHK Apartment (450 - 600 sq.ft)</option>
              <option value="2BHK">2 BHK Apartment (750 - 1,050 sq.ft)</option>
              <option value="3BHK">3 BHK Apartment (1,200 - 1,600 sq.ft)</option>
              <option value="4BHK_VILLA">4 BHK / Independent Villa (2,000+ sq.ft)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Interior Scope of Work</label>
            <select
              value={interiorScope}
              onChange={(e) => setInteriorScope(e.target.value)}
              className="form-select"
            >
              <option value="MODULAR_KITCHEN">Modular Kitchen Only (Acrylic / Marine Ply)</option>
              <option value="ESSENTIALS">Essentials (Kitchen + Master Wardrobe + Basic False Ceiling)</option>
              <option value="FULL_HOME">Complete Turnkey Interior (Full Woodwork & Living)</option>
              <option value="LUXURY">Luxury Turnkey Interior (Veneer, PU Polish, Smart Lighting)</option>
            </select>
          </div>
        </div>

        {/* Calculation Output Card */}
        {estimateResult && (
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4 pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs text-muted font-semibold uppercase tracking-wider">Estimated Interior Package Cost</div>
                <div className="text-3xl font-extrabold text-primary">
                  ₹{estimateResult.totalEstimatedCost?.toLocaleString()}
                </div>
                <div className="text-xs text-muted mt-1">
                  Configuration: <strong>{estimateResult.homeType} • {estimateResult.interiorScope?.replace('_', ' ')}</strong>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div style={{ textAlign: 'right' }}>
                  <div className="text-xs text-muted">Estimated Handover:</div>
                  <div className="text-base font-bold text-secondary flex items-center gap-1 justify-end">
                    <Clock size={16} className="text-primary" /> {estimateResult.estimatedTimeline}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPrefill({
                      title: `${estimateResult.homeType} Interior Makeover (${estimateResult.interiorScope?.replace('_', ' ')})`,
                      category: 'INTERIOR_DESIGNER',
                      description: `Turnkey interior work for ${estimateResult.homeType}. Benchmark estimate is ₹${estimateResult.totalEstimatedCost?.toLocaleString()}.`,
                      estimatedBudget: estimateResult.totalEstimatedCost,
                      propertyType: `${estimateResult.homeType} Apartment`,
                    });
                    setRequestModalOpen(true);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Post Job for Designer Quotes
                </button>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase text-muted mb-3">Itemized Scope Breakdown:</h4>
              <div className="grid grid-cols-2 gap-3">
                {estimateResult.costBreakdown &&
                  Object.entries(estimateResult.costBreakdown).map(([label, val]) => (
                    <div
                      key={label}
                      style={{
                        background: '#ffffff',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span className="text-xs text-secondary font-medium">{label}</span>
                      <strong className="text-xs text-primary font-bold">₹{val.toLocaleString()}</strong>
                    </div>
                  ))}
              </div>
            </div>

            {/* Details */}
            {estimateResult.itemizedDetails && (
              <div className="grid grid-cols-2 gap-2 text-xs text-muted mb-4 pt-3 border-t border-slate-200">
                {Object.entries(estimateResult.itemizedDetails).map(([k, v]) => (
                  <div key={k}>
                    <strong>{k}:</strong> {v}
                  </div>
                ))}
              </div>
            )}

            <div className="estimate-disclaimer">
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{estimateResult.disclaimer}</span>
            </div>
          </div>
        )}
      </div>

      {/* Interior Packages Catalog */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Turnkey Interior Design Packages</h2>
            <p className="text-sm text-muted">Modular furniture, kitchen systems, and atmospheric false ceilings.</p>
          </div>
          <button
            onClick={() => {
              setSelectedPrefill(null);
              setRequestModalOpen(true);
            }}
            className="btn btn-outline-primary btn-sm"
          >
            + Request Custom Design Quote
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="card card-hover flex flex-col justify-between" style={{ padding: '1.5rem' }}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="badge badge-amber text-xs">{pkg.badgeText || 'Interior'}</span>
                  <EstimateBadge text="Estimate" size="xs" />
                </div>
                <h3 className="font-bold text-lg mb-2">{pkg.title}</h3>
                <p className="text-xs text-muted mb-4" style={{ lineHeight: 1.6 }}>{pkg.detailedDescription}</p>

                <div className="flex flex-col gap-2 mb-6">
                  {pkg.features &&
                    pkg.features.split('||').map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted">
                        <CheckCircle2 size={13} className="text-success flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }} className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted">Starting Rate:</div>
                  <div className="font-extrabold text-xl text-primary">
                    ₹{pkg.startingPrice?.toLocaleString()} <span className="text-xs text-muted font-normal">/ {pkg.pricingUnit}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPrefill({
                      title: pkg.title,
                      category: 'INTERIOR_DESIGNER',
                      description: `Interested in ${pkg.title}. ${pkg.shortDescription}`,
                      estimatedBudget: pkg.startingPrice,
                    });
                    setRequestModalOpen(true);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Request Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <ServiceRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => {
          setRequestModalOpen(false);
          setSelectedPrefill(null);
        }}
        prefillData={selectedPrefill}
        onSuccess={() => alert('Interior service request posted! Check your customer dashboard.')}
      />
    </div>
  );
}
