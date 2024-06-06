import Axios from "axios";

const updateUserName = async (userId, userNewName) => {
    const token = localStorage.getItem('token');
    try {
        Axios.defaults.headers.common['Authorization'] = token;
        const response = await Axios.put(`http://localhost:3000/users/update-name/${userId}`, userNewName);
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default updateUserName;
