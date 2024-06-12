import Axios from "axios";

const removeUserDisplayedImg = async (userId) => {
    const token = localStorage.getItem('token');
    try {
        Axios.defaults.headers.common['Authorization'] = token;
        const response = await Axios.put(`http://localhost:3000/users/remove-display-img/${userId}`);
        return response; // Return the response
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default removeUserDisplayedImg;
