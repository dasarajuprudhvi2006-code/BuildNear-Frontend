import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const CITIES = [
  // Western Region
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, region: 'Maharashtra' },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, region: 'Maharashtra' },
  { name: 'Nagpur', lat: 21.1458, lng: 79.0882, region: 'Maharashtra' },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, region: 'Gujarat' },
  { name: 'Surat', lat: 21.1702, lng: 72.8311, region: 'Gujarat' },
  { name: 'Goa (Panaji)', lat: 15.4909, lng: 73.8278, region: 'Goa' },

  // Northern Region
  { name: 'Delhi NCR', lat: 28.6139, lng: 77.2090, region: 'Delhi' },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873, region: 'Rajasthan' },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462, region: 'Uttar Pradesh' },
  { name: 'Kanpur', lat: 26.4499, lng: 80.3319, region: 'Uttar Pradesh' },
  { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, region: 'Punjab / Haryana' },
  { name: 'Dehradun', lat: 30.3165, lng: 78.0322, region: 'Uttarakhand' },
  { name: 'Shimla', lat: 31.1048, lng: 77.1734, region: 'Himachal Pradesh' },
  { name: 'Srinagar', lat: 34.0837, lng: 74.7973, region: 'Jammu & Kashmir' },

  // Southern Region
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, region: 'Karnataka' },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, region: 'Telangana' },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, region: 'Tamil Nadu' },
  { name: 'Coimbatore', lat: 11.0168, lng: 76.9558, region: 'Tamil Nadu' },
  { name: 'Kochi', lat: 9.9312, lng: 76.2673, region: 'Kerala' },
  { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366, region: 'Kerala' },
  { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, region: 'Andhra Pradesh' },
  { name: 'Vijayawada', lat: 16.5062, lng: 80.6480, region: 'Andhra Pradesh' },

  // Eastern & North-Eastern Region
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, region: 'West Bengal' },
  { name: 'Patna', lat: 25.5941, lng: 85.1376, region: 'Bihar' },
  { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245, region: 'Odisha' },
  { name: 'Ranchi', lat: 23.3441, lng: 85.3096, region: 'Jharkhand' },
  { name: 'Guwahati', lat: 26.1445, lng: 91.7362, region: 'Assam' },
  { name: 'Agartala', lat: 23.8315, lng: 91.2868, region: 'Tripura' },

  // Central Region
  { name: 'Bhopal', lat: 23.2599, lng: 77.4126, region: 'Madhya Pradesh' },
  { name: 'Indore', lat: 22.7196, lng: 75.8577, region: 'Madhya Pradesh' },
  { name: 'Raipur', lat: 21.2514, lng: 81.6296, region: 'Chhattisgarh' }
];

export const LocationProvider = ({ children }) => {
  const [city, setCity] = useState(localStorage.getItem('BUILDCONNECTION_city') || 'Mumbai');
  const [lat, setLat] = useState(() => {
    const saved = localStorage.getItem('BUILDCONNECTION_lat');
    return saved ? parseFloat(saved) : 19.0760;
  });
  const [lng, setLng] = useState(() => {
    const saved = localStorage.getItem('BUILDCONNECTION_lng');
    return saved ? parseFloat(saved) : 72.8777;
  });
  const [radiusKm, setRadiusKm] = useState(25);
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [detectingGps, setDetectingGps] = useState(false);

  const setManualCity = (cityName) => {
    const found = CITIES.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
    if (found) {
      setCity(found.name);
      setLat(found.lat);
      setLng(found.lng);
      setIsGpsActive(false);
      setGpsError(null);
      localStorage.setItem('BUILDCONNECTION_city', found.name);
      localStorage.setItem('BUILDCONNECTION_lat', found.lat.toString());
      localStorage.setItem('BUILDCONNECTION_lng', found.lng.toString());
    }
  };

  const setCustomCoordinates = (cityName, customLat, customLng) => {
    setCity(cityName);
    setLat(customLat);
    setLng(customLng);
    setIsGpsActive(false);
    localStorage.setItem('BUILDCONNECTION_city', cityName);
    localStorage.setItem('BUILDCONNECTION_lat', customLat.toString());
    localStorage.setItem('BUILDCONNECTION_lng', customLng.toString());
  };

  const detectGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser. Using manual city selection.');
      return;
    }

    setDetectingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const detectedLat = Math.round(position.coords.latitude * 10000) / 10000;
        const detectedLng = Math.round(position.coords.longitude * 10000) / 10000;
        setLat(detectedLat);
        setLng(detectedLng);
        setCity('My Current GPS Location');
        setIsGpsActive(true);
        setDetectingGps(false);
        localStorage.setItem('BUILDCONNECTION_city', 'Current Location');
        localStorage.setItem('BUILDCONNECTION_lat', detectedLat.toString());
        localStorage.setItem('BUILDCONNECTION_lng', detectedLng.toString());
      },
      (error) => {
        setDetectingGps(false);
        setIsGpsActive(false);
        let errorMsg = 'Could not retrieve GPS location. Using manual location selection.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission was denied. Please select your city manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information is unavailable. Switched to fallback city.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out. Switched to fallback city.';
        }
        setGpsError(errorMsg);
        // Fallback to default city
        setManualCity('Mumbai');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <LocationContext.Provider
      value={{
        city,
        lat,
        lng,
        radiusKm,
        isGpsActive,
        gpsError,
        detectingGps,
        setRadiusKm,
        setManualCity,
        setCustomCoordinates,
        detectGps,
        availableCities: CITIES,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
