import Axios from "axios";

const uploadImage = async (formData) => {
    const token = localStorage.getItem('token');
    try {
        Axios.defaults.headers.common['Authorization'] = token;
        const response = await Axios.post(`http://localhost:3000/uploads/upload-img`, formData);
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default uploadImage;
