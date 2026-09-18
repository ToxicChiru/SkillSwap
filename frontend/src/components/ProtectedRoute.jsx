import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading, isAuthenticated, demoLogin } = useAuth();
  const [autoLoggingIn, setAutoLoggingIn] = useState(false);
  const [autoLoginFailed, setAutoLoginFailed] = useState(false);

  useEffect(() => {
    // If user is not yet logged in and not currently loading,
    // seamlessly log in as the default demo persona (Aditya Verma)
    // so features like Matches, Requests, Sessions, and Wallet load immediately!
    if (!loading && !isAuthenticated && !autoLoggingIn && !autoLoginFailed) {
      setAutoLoggingIn(true);
      demoLogin('aditya.python@college.edu')
        .then(() => {
          setAutoLoggingIn(false);
        })
        .catch((err) => {
          console.error('Auto demo login error:', err);
          setAutoLoggingIn(false);
          setAutoLoginFailed(true);
        });
    }
  }, [loading, isAuthenticated, autoLoggingIn, autoLoginFailed, demoLogin]);

  if (loading || autoLoggingIn) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '1rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent-indigo)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: '500' }}>
          Loading student workspace...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
