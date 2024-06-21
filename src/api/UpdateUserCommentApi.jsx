import Axios from "axios";

const updateUserComment = async (commentId, userId, updateContent) => {
    const token = localStorage.getItem('token');
    try {
        Axios.defaults.headers.common['Authorization'] = token;
        const response = await Axios.put(`http://localhost:3000/posts/comment/${commentId}/${userId}`, updateContent);
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default updateUserComment;
