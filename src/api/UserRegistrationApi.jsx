import Axios from "axios";

const PostUserInfo = async (registrationFormData) => {
    try {
        const response = await Axios.post('http://localhost:3000/users/', registrationFormData);
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default PostUserInfo;
