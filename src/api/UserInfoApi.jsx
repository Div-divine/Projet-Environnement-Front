import { useState, useEffect } from 'react';
import Axios from 'axios';
import { useCsrf } from "../context/CsrfContext";
import retrieveEncryptedAdminToken from '../functions/GetAdminToken';

const useUserData = () => {
    const [userData, setUserData] = useState(null);
    const csrfToken = useCsrf();
    useEffect(() => {
        const fetchData = async () => {
            try {

                // Now, let's try retrieving and decrypt the stored token and userId
                const { token: decryptedToken, userId: decryptedUserId } = await retrieveEncryptedAdminToken();
                if (decryptedToken) {
                    // Set the default Authorization header for all requests
                    Axios.defaults.headers.common['Authorization'] = decryptedToken;
                    Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
                    // Make a GET request to the protected route
                    const response = await Axios.get('http://localhost:3000/users/info');

                    // Store fetched data
                    setUserData(response.data.user);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, []);

    useEffect(() => {
        console.log(userData); // This will log the fetched data
    }, [userData]); // This ensures the log statement runs whenever `userData` changes

    return userData;
};

export default useUserData;
