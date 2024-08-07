import Axios from 'axios';
import { useState, useEffect } from 'react';
import { useCsrf } from "../context/CsrfContext";
import retrieveEncryptedAdminToken from '../functions/GetAdminToken';

const useGroupsData = () => {
    const [groupsData, setGroupsData] = useState(null);
    const csrfToken = useCsrf(); // Access CSRF token from context
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Now, let's try retrieving and decrypt the stored token and userId
                const { token: decryptedToken, userId: decryptedUserId } = await retrieveEncryptedAdminToken();
                if (decryptedToken) {
                    // Set the default Authorization header for all requests
                    Axios.defaults.headers.common['Authorization'] = decryptedToken;
                    // Set CSRF token in headers
                    Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
                    // Make a GET request to the protected route
                    const response = await Axios.get('http://localhost:3000/groups');
                    // Store fetched data
                    setGroupsData(response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, [csrfToken]);

    useEffect(() => {
        console.log(groupsData); // This will log the fetched data
    }, [groupsData]); // This ensures the log statement runs whenever `userData` changes

    return groupsData;
};

export default useGroupsData;
