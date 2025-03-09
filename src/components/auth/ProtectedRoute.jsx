import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, AuthContext } from '../auth/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, userData } = useAuth();

  // Check if the user is logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If a specific role is required, check the user's role
  if (requiredRole && userData?.role !== requiredRole) {
    // Optionally redirect to a different page if the role does not match
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
