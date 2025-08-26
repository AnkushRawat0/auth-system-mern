import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './context/AuthContext';


// Placeholder components for now
const HomePage = () => <h1>Home Page (Public)</h1>;
const DashboardPage = () => <h1>Dashboard (Protected)</h1>;
const AdminPage = () => <h1>Admin Page (Protected - Admin Only)</h1>;


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
        {/* Example of role-based protection */}
        {userRole === 'admin' && <Route path="/admin" element={<AdminPage />} />}
      </Route>

      {/* Catch-all for undefined routes */}
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
};


export default AppRoutes;