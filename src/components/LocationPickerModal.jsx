import React, { useState } from 'react';
import { MapPin, Navigation, X, Check, Compass } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

export default function LocationPickerModal({ isOpen, onClose }) {
  const { city, isGpsActive, gpsError, detectingGps, setManualCity, detectGps, availableCities } = useLocation();
  const [customCity, setCustomCity] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Compass className="text-primary" size={22} />
            <h3 className="text-lg font-bold">Select Service Area</h3>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body flex flex-col gap-4">
          <p className="text-sm text-muted">
            Choose your current area to find nearby construction professionals, calculate exact travel distances, and view localized rate estimates.
          </p>

          {/* GPS Auto-detect Button */}
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <button
              onClick={() => {
                detectGps();
                onClose();
              }}
              disabled={detectingGps}
              className="btn btn-primary w-full"
              style={{ width: '100%' }}
            >
              <Navigation size={16} className={detectingGps ? 'animate-spin' : ''} />
              <span>{detectingGps ? 'Detecting Location...' : 'Use My GPS Current Location'}</span>
            </button>
            {isGpsActive && (
              <p className="text-xs text-success font-medium mt-2 flex items-center gap-1">
                <Check size={14} /> GPS location active and tracking nearby tradespeople.
              </p>
            )}
            {gpsError && (
              <p className="text-xs text-danger mt-2">
                {gpsError}
              </p>
            )}
          </div>

          <div>
            <label className="form-label mb-2 block">Or Select a State / City Hub ({availableCities.length} Regions):</label>
            <div className="grid grid-cols-2 gap-2" style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
              {availableCities.map((c) => {
                const isSelected = city.toLowerCase() === c.name.toLowerCase() && !isGpsActive;
                return (
                  <button
                    key={c.name}
                    onClick={() => {
                      setManualCity(c.name);
                      onClose();
                    }}
                    className={`btn text-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                    style={{ justifyContent: 'flex-start', padding: '10px 12px' }}
                  >
                    <MapPin size={15} />
                    <div style={{ textAlign: 'left' }}>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-xs text-muted" style={{ opacity: isSelected ? 0.9 : 0.7 }}>{c.region}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-outline btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
