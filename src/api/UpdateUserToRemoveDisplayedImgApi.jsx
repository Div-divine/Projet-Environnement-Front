import Axios from "axios";

const removeUserDisplayedImg = async (userId, csrfToken) => {
    const token = localStorage.getItem('token');

    try {
        Axios.defaults.headers.common['Authorization'] = token;
        Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
        const response = await Axios.put(`http://localhost:3000/users/remove-display-img/${userId}`);
        return response; // Return the response
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default removeUserDisplayedImg;
