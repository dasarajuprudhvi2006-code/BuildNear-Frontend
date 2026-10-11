import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import NearbyProfessionals from './pages/NearbyProfessionals';
import ExploreServices from './pages/ExploreServices';
import ProfessionalProfilePage from './pages/ProfessionalProfilePage';
import HouseConstructionPage from './pages/HouseConstructionPage';
import InteriorDesignPage from './pages/InteriorDesignPage';
import CompareQuotationsPage from './pages/CompareQuotationsPage';
import BookingPage from './pages/BookingPage';
import CustomerDashboard from './pages/CustomerDashboard';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AboutContactPage from './pages/AboutContactPage';
import AuthPage from './pages/AuthPage';

// Protected Route wrappers
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return <div className="container py-24 text-center text-muted">Checking authentication...</div>;
  if (!isAuthenticated) return <Navigate to="/auth?mode=login" replace />;
  if (requiredRole && role !== requiredRole) {
    if (role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
    if (role === 'ROLE_PROFESSIONAL') return <Navigate to="/pro-dashboard" replace />;
    return <Navigate to="/customer-dashboard" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <LocationProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/nearby" element={<NearbyProfessionals />} />
                <Route path="/services" element={<ExploreServices />} />
                <Route path="/professionals/:id" element={<ProfessionalProfilePage />} />
                <Route path="/construction" element={<HouseConstructionPage />} />
                <Route path="/interior" element={<InteriorDesignPage />} />
                <Route path="/compare-quotes/:requestId" element={<CompareQuotationsPage />} />
                <Route path="/book/:professionalId" element={<BookingPage />} />
                <Route
                  path="/customer-dashboard"
                  element={
                    <ProtectedRoute>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pro-dashboard"
                  element={
                    <ProtectedRoute requiredRole="ROLE_PROFESSIONAL">
                      <ProfessionalDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="ROLE_ADMIN">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/about" element={<AboutContactPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </LocationProvider>
      </AuthProvider>
    </Router>
  );
}
