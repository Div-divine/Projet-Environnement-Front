import Axios from "axios";

const updateUserPost = async (postId, userId, postContent, csrfToken) => {
    const token = localStorage.getItem('token');

    try {
        Axios.defaults.headers.common['Authorization'] = token;
        Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
        const response = await Axios.put(`http://localhost:3000/posts/${postId}/${userId}`, postContent);
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default updateUserPost;
