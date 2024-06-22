import Axios from "axios";

const userQuitGroupSatus = async (userId, groupId, csrfToken) => {
    const token = localStorage.getItem('token');

    try {
        Axios.defaults.headers.common['Authorization'] = token;
        // Set CSRF token in headers
        Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
        const response = await Axios.get(`http://localhost:3000/usergroups/user-quit-group-status/${userId}/${groupId}`);
        return response.data; // Return the response data
    } catch (error) {
        console.log('Error:', error); // Log the error
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default userQuitGroupSatus;
