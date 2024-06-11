import Axios from "axios";

const sendUsrImgDb = async (data) => {
    const token = localStorage.getItem('token');
    try {
        Axios.defaults.headers.common['Authorization'] = token;
        const response = await Axios.post('http://localhost:3000/users/usr-img', data);
        return response; // Return the response 
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default sendUsrImgDb;
