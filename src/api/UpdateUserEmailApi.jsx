import Axios from "axios";

const updateUserEmail = async (userId, userNewEmail) => {
    const token = localStorage.getItem('token');
    try {
        Axios.defaults.headers.common['Authorization'] = token;
        const response = await Axios.put(`http://localhost:3000/users/update-email/${userId}`, userNewEmail);
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default updateUserEmail;
