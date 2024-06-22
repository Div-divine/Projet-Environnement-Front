import Axios from "axios";

const singleGroupData = async (groupId, csrfToken) => {
    const token = localStorage.getItem('token');

    try {
        Axios.defaults.headers.common['Authorization'] = token;
        Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
        const response = await Axios.get(`http://localhost:3000/groups/${groupId}`);
        return response.data; // Return the response data
    } catch (error) {
        console.log('Error:', error); // Log the error
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default singleGroupData;
