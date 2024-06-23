import Axios from "axios";

const SendUserInfo = async (credentials ) => {
    try {
        localStorage.clear();

        const response = await Axios.post(`http://localhost:3000/users/login`, credentials);
        console.log('response:', response);

        const token = response.data.token;
        console.log('Access token from API:', token);
        return token;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

export default SendUserInfo;
