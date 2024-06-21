import Axios from "axios";

const uploadImage = async (userId, formData) => {
    const token = localStorage.getItem('token');
    try {
        Axios.defaults.headers.common['Authorization'] = token;
        const response = await Axios.post(`http://localhost:3000/uploads/upload-img/${userId}`, formData);
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default uploadImage;
