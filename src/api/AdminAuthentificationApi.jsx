import { useState, useEffect } from 'react';
import Axios from 'axios';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem('admin-auth');
  console.log('Admin Token from localStorage:', token);

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    // Set the default Authorization and Admin-Auth headers for all requests
    Axios.defaults.headers.common['Authorization'] = token;
    Axios.defaults.headers.common['Admin-Auth'] = token;

    // Make a GET request to the protected route to verify the token
    Axios.get('http://localhost:3000/admin/authentification') // Include the base URL
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, [token]);

  return { isAuthenticated };
}
