import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('aceMeklitUser');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('aceMeklitUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const { data } = await authApi.login({ email, password });
      setUser(data);
      localStorage.setItem('aceMeklitUser', JSON.stringify(data));
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (name, email, password, phone) => {
    setError(null);
    try {
      const { data } = await authApi.register({ name, email, password, phone });
      setUser(data);
      localStorage.setItem('aceMeklitUser', JSON.stringify(data));
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    localStorage.setItem('aceMeklitUser', JSON.stringify(merged));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aceMeklitUser');
  };

  const value = {
    user,
    loading,
    error,
    isAdmin: user?.role === 'admin',
    login,
    register,
    updateUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
