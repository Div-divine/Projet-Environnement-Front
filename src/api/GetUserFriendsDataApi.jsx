import Axios from "axios";

const GetAllUserFriendsData = async (userId) => {
    const token = localStorage.getItem('token');

    try {
        Axios.defaults.headers.common['Authorization'] = token;
        const response = await Axios.get(`http://localhost:3000/datas/user-friends-data/${userId}`);
        return response.data; // Return the response data
    } catch (error) {
        console.log('Error:', error); // Log the error
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default GetAllUserFriendsData;
