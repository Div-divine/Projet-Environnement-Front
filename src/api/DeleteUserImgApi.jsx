import Axios from "axios";

const DeleteUserImg = async (csrfToken, userId, data = null) => {
    const token = localStorage.getItem('token');
    try {
        Axios.defaults.headers.common['Authorization'] = token;
        // Set CSRF token in headers
        Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
        const response = await Axios.post(`http://localhost:3000/uploads/delete-img/${userId}`, data);
        return response.status; // Return the response status
    } catch (error) {
        console.log('Error:', error); // Log the error
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default DeleteUserImg;
