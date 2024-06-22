import Axios from "axios";

const updateUserPwd = async (userId, data, csrfToken) => {
    const token = localStorage.getItem('token');

    try {
        Axios.defaults.headers.common['Authorization'] = token;
        Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
        const response = await Axios.put(`http://localhost:3000/users/update-pwd/${userId}`, data);
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default updateUserPwd;
