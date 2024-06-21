import Axios from "axios";
const DeletePostAndComments = async (postId, userId) => {
    const token = localStorage.getItem('token');
    try {
        Axios.defaults.headers.common['Authorization'] = token;
        const response = await Axios.delete(`http://localhost:3000/posts/${postId}/${userId}`);
        return response; // Return the response data
    } catch (error) {
        console.log('Error:', error); // Log the error
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default DeletePostAndComments;
