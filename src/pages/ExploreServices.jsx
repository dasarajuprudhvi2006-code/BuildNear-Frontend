import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  HardHat,
  Sparkles,
  Hammer,
  PenTool,
  Zap,
  Wrench,
  Paintbrush,
  Users,
  Compass,
  Home,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import EstimateBadge from '../components/EstimateBadge';

export default function ExploreServices() {
  const serviceCategories = [
    {
      category: 'HOUSE_CONSTRUCTION',
      title: 'Complete House Construction & Civil Works',
      badge: 'Core Construction',
      icon: Building2,
      description: 'End-to-end structural construction from soil testing to RCC slab casting, brickwork, and turnkey house delivery.',
      subservices: [
        { name: 'Site Inspection & Soil Testing', unit: '₹4,999 / visit', code: 'CIVIL_ENGINEER' },
        { name: '2D Blueprints & 3D Architectural Elevation', unit: '₹15 / sq.ft', code: 'ARCHITECT' },
        { name: 'RCC Column Layout & Foundation Casting', unit: '₹1,850 / sq.ft', code: 'CIVIL_ENGINEER' },
        { name: 'Red Brick & AAC Block Masonry', unit: '₹850 / day', code: 'MASON' },
        { name: 'Roof Slab Casting & Waterproofing', unit: '₹18 / sq.ft', code: 'MASON' },
        { name: 'Turnkey Residential Construction Packages', unit: '₹2,150 / sq.ft', code: 'BUILDER_CONTRACTOR' },
      ],
      link: '/construction',
    },
    {
      category: 'INTERIOR_DESIGN',
      title: 'Turnkey Interior Design & Styling',
      badge: 'Design & Woodwork',
      icon: Sparkles,
      description: 'Contemporary space planning, 3D walkthroughs, modular kitchens, wardrobes, and designer lighting fixtures.',
      subservices: [
        { name: '3D Photorealistic Interior Walkthroughs', unit: '₹35,000 / project', code: 'INTERIOR_DESIGNER' },
        { name: 'Modular Kitchen (Marine Ply + Acrylic)', unit: '₹1,45,000 / project', code: 'INTERIOR_DESIGNER' },
        { name: 'Floor-to-Ceiling Wardrobes & Hydraulic Beds', unit: '₹800 / day', code: 'CARPENTER' },
        { name: 'Gyproc False Ceiling & Ambient Cove LED', unit: '₹85 / sq.ft', code: 'INTERIOR_DESIGNER' },
        { name: 'Royale Luxury Emulsion & Texture Stencils', unit: '₹18 / sq.ft', code: 'PAINTER' },
        { name: 'Full 2 BHK / 3 BHK Turnkey Makeovers', unit: '₹4,20,000 / project', code: 'INTERIOR_DESIGNER' },
      ],
      link: '/interior',
    },
    {
      category: 'SPECIALIST_TRADES',
      title: 'Specialist MEP & On-Demand Labor Squads',
      badge: 'Certified Trades',
      icon: HardHat,
      description: 'Government certified wiremen, master plumbers, structural welders, and reliable daily-wage workforce teams.',
      subservices: [
        { name: '3-Phase Panel Wiring & Conduit Cabling', unit: '₹450 / day', code: 'ELECTRICIAN' },
        { name: 'High-Tension Linework & Transformer Tie-in', unit: '₹950 / day', code: 'LINEMAN' },
        { name: 'CPVC Concealed Piping & Bathroom Remodeling', unit: '₹400 / day', code: 'PLUMBER' },
        { name: 'Safety Grills, MS Staircases & Steel Welding', unit: '₹120 / sq.ft', code: 'WELDER' },
        { name: 'Daily-Wage Skilled & Semi-Skilled Labor Teams', unit: '₹600 / day', code: 'DAILY_WAGE_WORKER' },
        { name: 'Terrace Anti-Seepage Waterproofing Coatings', unit: '₹22 / sq.ft', code: 'PAINTER' },
      ],
      link: '/nearby',
    },
  ];

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
        <span className="badge badge-amber text-xs mb-2">DIRECTORY</span>
        <h1 className="text-3xl font-extrabold mb-3">Construction & Interior Services Directory</h1>
        <p className="text-muted text-base" style={{ lineHeight: 1.6 }}>
          Explore specialized services across every phase of residential and commercial property development. Check transparent regional baseline rates and instantly connect with vetted professionals.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {serviceCategories.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div key={idx} className="card" style={{ padding: '2rem' }}>
              <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    style={{
                      background: '#fef3c7',
                      color: '#d97706',
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={26} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">{sec.title}</h2>
                      <span className="badge badge-amber text-xs">{sec.badge}</span>
                    </div>
                    <p className="text-sm text-muted mt-1">{sec.description}</p>
                  </div>
                </div>

                <Link to={sec.link} className="btn btn-outline-primary btn-sm">
                  Explore Module <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                {sec.subservices.map((sub, sIdx) => (
                  <div
                    key={sIdx}
                    style={{
                      background: '#f8fafc',
                      borderRadius: '10px',
                      padding: '1rem',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                    }}
                  >
                    <div>
                      <div className="font-semibold text-sm mb-1 text-secondary">{sub.name}</div>
                      <div className="text-xs text-muted flex items-center gap-1 mb-3">
                        Estimated Starting: <strong className="text-primary">{sub.unit}</strong> <EstimateBadge text="Est." size="xs" />
                      </div>
                    </div>

                    <Link
                      to={`/nearby?category=${sub.code}`}
                      className="text-xs font-bold text-primary hover:underline flex items-center justify-between"
                    >
                      <span>Find Specialists</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
