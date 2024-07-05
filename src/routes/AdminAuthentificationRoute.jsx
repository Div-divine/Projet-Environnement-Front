import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../api/AdminAuthentificationApi';

const AdminRoute = () => {
    const { isAuthenticated } = useAdminAuth();
    const location = useLocation();

    // Redirect to login page if not authenticated and not already on login page
    if (!isAuthenticated && location.pathname !== '/admin/connexion') {
        return <Navigate to="/admin/connexion" replace />;
    }

    // User is authenticated, render the requested page
    return <Outlet />;
};

export default AdminRoute;
