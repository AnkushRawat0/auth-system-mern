import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import { useAuth } from './context/AuthContext';





const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  const userRole = user?.role;

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
       <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Admin route - always render but protect with role check inside */}
        <Route 
          path="/admin" 
          element={<AdminPage /> } />
      </Route>

      {/* Catch-all for undefined routes */}
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
};


export default AppRoutes;