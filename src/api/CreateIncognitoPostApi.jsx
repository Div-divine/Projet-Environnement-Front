import Axios from "axios";

const insertUserPostIncognito = async (userPostAndGroup, csrfToken) => {
    const token = localStorage.getItem('token');

    try {
        Axios.defaults.headers.common['Authorization'] = token;
        // Set CSRF token in headers
        Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
        const response = await Axios.post('http://localhost:3000/posts/incognito', userPostAndGroup);
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default insertUserPostIncognito;
