import Axios from "axios";
import storeEncryptedAdminToken from "../functions/StoreAdminEncryptedToken";

const SendUserInfo = async (credentials ) => {
    try {
        const response = await Axios.post(`http://localhost:3000/users/login`, credentials);
        console.log('response:', response);

        const token = response.data.token;
        const userId = response.data.userId
        if(token && userId){
            await storeEncryptedAdminToken(token, userId);
            localStorage.setItem('userId', userId)
            console.log('Access token from API:', token);
            console.log('Access User info from login API:', response.data);
            return token;
        }
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

export default SendUserInfo;
