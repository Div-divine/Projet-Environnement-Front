import React, { createContext, useContext, useState, useEffect } from 'react';
import Axios from 'axios';

const CsrfContext = createContext();

export const useCsrf = () => useContext(CsrfContext);

export const CsrfProvider = ({ children }) => {
    const [csrfToken, setCsrfToken] = useState(null);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token && userId) {
            const fetchCsrfToken = async () => {
                try {
                    Axios.defaults.headers.common['Authorization'] = token;
                    const response = await Axios.get(`http://localhost:3000/csrf-token/${userId}`);
                    setCsrfToken(response.data.csrfToken);
                } catch (error) {
                    console.error('Error fetching CSRF token:', error);
                }
            };

            fetchCsrfToken();
        }
    }, [token, userId]);

    return (
        <CsrfContext.Provider value={csrfToken}>
            {children}
        </CsrfContext.Provider>
    );
};
