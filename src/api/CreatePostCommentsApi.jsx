import Axios from "axios";

const insertPostComment = async (userPostComment, csrfToken) => {
    const token = localStorage.getItem('token');

    try {
        Axios.defaults.headers.common['Authorization'] = token;
        // Set CSRF token in headers
        Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
        const response = await Axios.post('http://localhost:3000/posts/comment', userPostComment);
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default insertPostComment;
