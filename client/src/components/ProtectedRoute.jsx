import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    // Logged in, but this role has no business on this page — send them
    // to the landing page rather than showing a broken/forbidden screen.
    return <Navigate to="/" replace />;
  }

  return children;
}
