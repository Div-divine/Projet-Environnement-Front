import Axios from "axios";

const userQuitsGroup = async (groupId, userId) => {
    const token = localStorage.getItem('token');
    try {
        Axios.defaults.headers.common['Authorization'] = token;
        const response = await Axios.put(`http://localhost:3000/usergroups/quit-group/${groupId}`, userId);
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default userQuitsGroup;
