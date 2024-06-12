import Axios from "axios";

const userDisplayedImg = async (userId) => {
    const token = localStorage.getItem('token');
    try {
        Axios.defaults.headers.common['Authorization'] = token;
        const response = await Axios.put(`http://localhost:3000/users/display-img/${userId}`);
        return response; // Return the response
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default userDisplayedImg;
