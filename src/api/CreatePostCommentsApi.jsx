import Axios from "axios";

const insertPostComment = async (userPostComment) => {
    const token = localStorage.getItem('token');
    try {
        Axios.defaults.headers.common['Authorization'] = token;
        const response = await Axios.post('http://localhost:3000/posts/comment', userPostComment);
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default insertPostComment;
