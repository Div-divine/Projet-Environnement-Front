import React, { createContext, useContext, useState, useEffect } from 'react';
import Axios from 'axios';
import retrieveEncryptedAdminToken from '../functions/GetAdminToken';

const CsrfContext = createContext();

export const useCsrf = () => useContext(CsrfContext);

export const CsrfProvider = ({ children }) => {
  const [csrfToken, setCsrfToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const { token: decryptedToken, userId: decryptedUserId } = await retrieveEncryptedAdminToken();
        if (decryptedToken && decryptedUserId) {
          Axios.defaults.headers.common['Authorization'] = decryptedToken;
          const response = await Axios.get(`http://localhost:3000/csrf-token/${decryptedUserId}`);
          setCsrfToken(response.data.csrfToken);
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <CsrfContext.Provider value={csrfToken}>
      {children}
    </CsrfContext.Provider>
  );
};
