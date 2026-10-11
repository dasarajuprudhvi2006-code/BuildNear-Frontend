import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('BUILDCONNECTION_token') || null);
  const [role, setRole] = useState(localStorage.getItem('BUILDCONNECTION_role') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('BUILDCONNECTION_token');
      if (storedToken) {
        try {
          const res = await apiClient.get('/auth/me');
          if (res.success && res.data) {
            setUser(res.data);
            setRole(res.data.role);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Failed to verify token on startup', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.success && res.data) {
      const authData = res.data;
      localStorage.setItem('BUILDCONNECTION_token', authData.token);
      localStorage.setItem('BUILDCONNECTION_role', authData.role);
      localStorage.setItem('BUILDCONNECTION_userId', authData.userId);
      setToken(authData.token);
      setRole(authData.role);

      // fetch profile details
      try {
        const meRes = await apiClient.get('/auth/me');
        setUser(meRes.data);
      } catch (e) {
        setUser({ id: authData.userId, email: authData.email, fullName: authData.fullName, role: authData.role });
      }
      return authData;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (registerData) => {
    const res = await apiClient.post('/auth/register', registerData);
    if (res.success && res.data) {
      const authData = res.data;
      localStorage.setItem('BUILDCONNECTION_token', authData.token);
      localStorage.setItem('BUILDCONNECTION_role', authData.role);
      localStorage.setItem('BUILDCONNECTION_userId', authData.userId);
      setToken(authData.token);
      setRole(authData.role);

      try {
        const meRes = await apiClient.get('/auth/me');
        setUser(meRes.data);
      } catch (e) {
        setUser({ id: authData.userId, email: authData.email, fullName: authData.fullName, role: authData.role });
      }
      return authData;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('BUILDCONNECTION_token');
    localStorage.removeItem('BUILDCONNECTION_role');
    localStorage.removeItem('BUILDCONNECTION_userId');
    setUser(null);
    setToken(null);
    setRole(null);
  };

  const demoLogin = async (demoRole) => {
    if (demoRole === 'CUSTOMER') {
      return await login('customer@BUILDCONNECTION.com', 'Customer@123');
    } else if (demoRole === 'PROFESSIONAL') {
      return await login('rajesh.mason@BUILDCONNECTION.com', 'Pro@123');
    } else if (demoRole === 'ADMIN') {
      return await login('admin@BUILDCONNECTION.com', 'Admin@123');
    }
  };

  const refreshUser = async () => {
    try {
      const meRes = await apiClient.get('/auth/me');
      if (meRes.success) {
        setUser(meRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        isAuthenticated: !!token,
        isCustomer: role === 'ROLE_CUSTOMER',
        isProfessional: role === 'ROLE_PROFESSIONAL',
        isAdmin: role === 'ROLE_ADMIN',
        login,
        register,
        logout,
        demoLogin,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
