import Axios from "axios";


const createFriends = async (friends, csrfToken) => {
    const token = localStorage.getItem('token');

    try {
        Axios.defaults.headers.common['Authorization'] = token;
        // Set CSRF token in headers
        Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
        const response = await Axios.post('http://localhost:3000/friends', friends);
        return response; // Return the response 
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default createFriends;
