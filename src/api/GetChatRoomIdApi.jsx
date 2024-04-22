import Axios from "axios";

const chatRoomId = async (user1, user2) => {
    const token = localStorage.getItem('token');
    try {
        Axios.defaults.headers.common['Authorization'] = token;
        const response = await Axios.get(`http://localhost:3000/chatroom/chatroom-id/${user1}/${user2}`);
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default chatRoomId;
