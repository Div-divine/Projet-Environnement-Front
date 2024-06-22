import Axios from "axios";


const UserWithGroups = async (data, csrfToken) => {
    const token = localStorage.getItem('token');

    try {
        Axios.defaults.headers.common['Authorization'] = token;
        // Set CSRF-Token header for request
        Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
        
        const response = await Axios.post('http://localhost:3000/usergroups/', data);
        return response; // Return the response data
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default UserWithGroups;