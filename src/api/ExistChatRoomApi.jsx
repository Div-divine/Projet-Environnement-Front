import Axios from "axios";

const existsChatroom = async (user1, user2, csrfToken) => {
    const token = localStorage.getItem('token');

    try {
        Axios.defaults.headers.common['Authorization'] = token;
        // Set CSRF token in headers
        Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
        const response = await Axios.get(`http://localhost:3000/chatroom/exists-chatroom/${user1}/${user2}`);
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default existsChatroom;
