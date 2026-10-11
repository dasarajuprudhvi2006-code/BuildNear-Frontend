import React, { useState, useEffect } from 'react';
import {
  Building2,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Layers,
  HardHat,
  FileText,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import apiClient from '../api/apiClient';
import EstimateBadge from '../components/EstimateBadge';
import ServiceRequestModal from '../components/ServiceRequestModal';

export default function HouseConstructionPage() {
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  // Estimator Calculator State
  const [builtUpArea, setBuiltUpArea] = useState(1500);
  const [floorsCount, setFloorsCount] = useState(1);
  const [packageTier, setPackageTier] = useState('STANDARD');
  const [estimateResult, setEstimateResult] = useState(null);
  const [estimating, setEstimating] = useState(false);

  // Request Modal
  const [isRequestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedPrefill, setSelectedPrefill] = useState(null);

  const fetchEstimate = async () => {
    try {
      setEstimating(true);
      const res = await apiClient.post('/estimations/construction', {
        builtUpAreaSqFt: parseFloat(builtUpArea) || 1200,
        floorsCount: parseInt(floorsCount, 10) || 1,
        packageTier,
      });
      if (res.success) {
        setEstimateResult(res.data);
      }
    } catch (err) {
      console.error('Failed to calculate estimate', err);
    } finally {
      setEstimating(false);
    }
  };

  useEffect(() => {
    fetchEstimate();
  }, [builtUpArea, floorsCount, packageTier]);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await apiClient.get('/packages?category=HOUSE_CONSTRUCTION');
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

  const constructionPhases = [
    { title: '1. Site Survey & Soil Testing', desc: 'Bearing capacity analysis, borehole sample testing, and boundary marking.' },
    { title: '2. Architecture & Municipal Approval', desc: '2D layouts, Vastu compliance, 3D daylight render, and municipal drawing sets.' },
    { title: '3. Foundation & RCC Columns', desc: 'Excavation, anti-termite treatment, Fe500D rebar cage, and column casting.' },
    { title: '4. Brickwork & Plastering', desc: 'Red clay brick or AAC lightweight blocks, lintel casting, and smooth sand plaster.' },
    { title: '5. Roof Slab & Waterproofing', desc: 'Centering, machine-mixed RCC M25 concrete slab casting, and polymer waterproofing.' },
    { title: '6. Electrical, Plumbing & Finishes', desc: 'Concealed conduit lines, vitrified tile flooring, sanitary fixtures, and final paint.' },
  ];

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }}>
        <span className="badge badge-amber text-xs mb-2">HOUSE CONSTRUCTION MODULE</span>
        <h1 className="text-3xl font-extrabold mb-3">Complete Turnkey House Construction</h1>
        <p className="text-muted text-base" style={{ lineHeight: 1.6 }}>
          Manage your residential building journey from foundation excavation to final key handover. Calculate instant estimated budgets and connect with verified architects, civil engineers, and master masons.
        </p>
      </div>

      {/* Interactive Construction Cost Estimator Calculator */}
      <div className="card mb-8" style={{ border: '2px solid #d97706', padding: '2rem', background: '#ffffff' }}>
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="text-primary" size={24} />
          <h2 className="text-xl font-extrabold text-secondary">House Construction Cost Estimator</h2>
          <EstimateBadge text="Instant Live Estimate" size="sm" />
        </div>
        <p className="text-xs text-muted mb-6">
          Adjust the parameters below to view an immediate indicative cost breakdown based on regional material and labor rates.
        </p>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="form-group">
            <label className="form-label">Built-up Area per floor (sq.ft)</label>
            <input
              type="number"
              min="300"
              max="20000"
              step="50"
              value={builtUpArea}
              onChange={(e) => setBuiltUpArea(e.target.value)}
              className="form-input"
            />
            <span className="text-xs text-muted mt-1">Plot footprint e.g. 1000, 1500, 2400</span>
          </div>

          <div className="form-group">
            <label className="form-label">Number of Floors</label>
            <select
              value={floorsCount}
              onChange={(e) => setFloorsCount(e.target.value)}
              className="form-select"
            >
              <option value="1">Ground Floor Only (G)</option>
              <option value="2">G + 1 Floor (Duplex)</option>
              <option value="3">G + 2 Floors</option>
              <option value="4">G + 3 Floors</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Material & Finishing Grade</label>
            <select
              value={packageTier}
              onChange={(e) => setPackageTier(e.target.value)}
              className="form-select"
            >
              <option value="BASIC">Basic (₹1,650 / sq.ft - Fe500 Steel, Standard Cement)</option>
              <option value="STANDARD">Standard Premium (₹2,150 / sq.ft - Tata Tiscon, Jaquar)</option>
              <option value="LUXURY">Luxury Villa (₹2,850 / sq.ft - Italian Marble, Smart Home)</option>
            </select>
          </div>
        </div>

        {/* Calculation Output Card */}
        {estimateResult && (
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4 pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs text-muted font-semibold uppercase tracking-wider">Total Estimated Construction Cost</div>
                <div className="text-3xl font-extrabold text-primary">
                  ₹{estimateResult.totalEstimatedCost?.toLocaleString()}
                </div>
                <div className="text-xs text-muted mt-1">
                  Rate: <strong>₹{estimateResult.ratePerUnit} / sq.ft</strong> • Built-up Area: <strong>{estimateResult.builtUpAreaSqFt} sq.ft</strong>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div style={{ textAlign: 'right' }}>
                  <div className="text-xs text-muted">Estimated Duration:</div>
                  <div className="text-base font-bold text-secondary flex items-center gap-1 justify-end">
                    <Clock size={16} className="text-primary" /> {estimateResult.estimatedTimeline}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPrefill({
                      title: `${estimateResult.floorsCount}-Storey House Construction (${estimateResult.packageTier} Grade)`,
                      category: 'BUILDER_CONTRACTOR',
                      description: `Turnkey house construction for ${estimateResult.builtUpAreaSqFt} sq.ft (${estimateResult.floorsCount} floor/s). Calculated estimate benchmark is ₹${estimateResult.totalEstimatedCost?.toLocaleString()}.`,
                      areaSqFt: estimateResult.builtUpAreaSqFt,
                      estimatedBudget: estimateResult.totalEstimatedCost,
                      propertyType: 'Residential Plot / House',
                    });
                    setRequestModalOpen(true);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Post Job for Actual Quotes
                </button>
              </div>
            </div>

            {/* Cost Breakdown Bars */}
            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase text-muted mb-3">Itemized Stage-wise Cost Breakdown:</h4>
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

            {/* Itemized Specs */}
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

      {/* House Construction Packages Catalog */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Turnkey House Construction Packages</h2>
            <p className="text-sm text-muted">Pre-structured civil and architectural specifications.</p>
          </div>
          <button
            onClick={() => {
              setSelectedPrefill(null);
              setRequestModalOpen(true);
            }}
            className="btn btn-outline-primary btn-sm"
          >
            + Request Custom Package Quote
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="card card-hover flex flex-col justify-between" style={{ padding: '1.5rem' }}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="badge badge-amber text-xs">{pkg.badgeText || 'Civil Package'}</span>
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
                    ₹{pkg.startingPrice} <span className="text-xs text-muted font-normal">/ {pkg.pricingUnit}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPrefill({
                      title: pkg.title,
                      category: 'BUILDER_CONTRACTOR',
                      description: `Interested in ${pkg.title}. ${pkg.shortDescription}`,
                      estimatedBudget: pkg.startingPrice * 1500,
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

      {/* Construction Lifecycle Stages */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 className="text-xl font-bold mb-4">Complete 6-Phase Construction Lifecycle</h2>
        <div className="grid grid-cols-3 gap-4">
          {constructionPhases.map((phase, idx) => (
            <div key={idx} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="font-bold text-sm text-secondary mb-1">{phase.title}</div>
                <p className="text-xs text-muted mb-3" style={{ lineHeight: 1.5 }}>{phase.desc}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedPrefill({
                    title: `Work Phase: ${phase.title}`,
                    category: idx <= 1 ? 'ARCHITECT' : idx <= 3 ? 'CIVIL_ENGINEER' : 'MASON',
                    description: `Need assistance with ${phase.title}. ${phase.desc}`,
                  });
                  setRequestModalOpen(true);
                }}
                className="btn btn-outline btn-sm text-primary font-bold"
                style={{ padding: '4px 8px', fontSize: '0.75rem', alignSelf: 'flex-start' }}
              >
                Request Quote for Phase →
              </button>
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
        onSuccess={() => alert('Construction service request posted! Check your customer dashboard.')}
      />
    </div>
  );
}
