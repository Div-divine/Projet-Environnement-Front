import { useState, useEffect } from 'react';
import Axios from 'axios';
import retrieveEncryptedAdminToken from '../functions/GetAdminToken';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticateAdmin = async () => {
      try {
        // Now, let's try retrieving and decrypt the stored token and userId
        const { token: decryptedToken, userId: decryptedUserId } = await retrieveEncryptedAdminToken();
        console.log('Token:', decryptedToken, ' and UserId encrypted: ', decryptedUserId, 'from authentification and authentificated is:', isAuthenticated );

        if (!decryptedToken || !decryptedUserId) {
          console.log('Token:', decryptedToken, ' and UserId encrypted: ', decryptedUserId, 'from authentification and authentificated is:', isAuthenticated );
          setIsAuthenticated(false);
          return;
        }

        // Set the default Authorization and Admin-Auth headers for all requests
        Axios.defaults.headers.common['Authorization'] = decryptedToken;
        Axios.defaults.headers.common['Admin-Auth'] = decryptedToken;

        // Make a GET request to the protected route to verify the token
        try {
          await Axios.get('http://localhost:3000/admin/authentification');
          setIsAuthenticated(true);
          console.log('Token:', decryptedToken, ' and UserId encrypted: ', decryptedUserId, 'from authentification and authentificated is:', isAuthenticated );
        } catch {
          console.log('Not Auth');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
        setIsAuthenticated(false);
      }
    };

    authenticateAdmin();
  }, []);

  return { isAuthenticated };
}
