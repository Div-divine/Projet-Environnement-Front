import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../api/AdminAuthentificationApi';

const AdminRoute = () => {
  const { isAuthenticated } = useAdminAuth(); // Destructure the `isAuthenticated` property
  const location = useLocation();

  if (!isAuthenticated) {
    // User is not authenticated, redirect to admin login page
    return <Navigate to="/admin/connexion" state={{ from: location }} replace />;
  }

  // User is authenticated, render the requested page
  return <Outlet />;
};

export default AdminRoute;
