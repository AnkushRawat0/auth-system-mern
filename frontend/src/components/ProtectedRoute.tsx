import { Navigate, Outlet } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => { // Removed React.FC
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;