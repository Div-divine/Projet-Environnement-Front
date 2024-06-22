import Axios from "axios";

const DeleteUserComments = async (commentId, userId, csrfToken) => {
    const token = localStorage.getItem('token');


    try {
        Axios.defaults.headers.common['Authorization'] = token;
        // Set CSRF token in headers
        Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
        const response = await Axios.delete(`http://localhost:3000/posts/comment/${commentId}/${userId}`);
        return response.data; // Return the response data
    } catch (error) {
        console.log('Error:', error); // Log the error
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default DeleteUserComments;
