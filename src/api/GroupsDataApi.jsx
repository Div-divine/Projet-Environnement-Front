import Axios from 'axios';
import { useState, useEffect } from 'react';

const useGroupsData = () => {
    const [groupsData, setGroupsData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get the token from localStorage
                const token = localStorage.getItem('token');
                // Set the default Authorization header for all requests
                Axios.defaults.headers.common['Authorization'] = token;

                // Make a GET request to the protected route
                const response = await Axios.get('http://localhost:3000/groups');
                
                // Store fetched data
                setGroupsData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, []);

    useEffect(() => {
        console.log(groupsData); // This will log the fetched data
    }, [groupsData]); // This ensures the log statement runs whenever `userData` changes

    return groupsData;
};

export default useGroupsData;
