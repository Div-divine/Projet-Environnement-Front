import Axios from "axios";
import retrieveEncryptedAdminToken from "../functions/GetAdminToken";

const sendUsrImgDb = async (data, csrfToken) => {
    // Now, let's try retrieving and decrypt the stored token and userId
    const { token: decryptedToken, userId: decryptedUserId } = await retrieveEncryptedAdminToken();

    try {
        if(decryptedToken){
            Axios.defaults.headers.common['Authorization'] = decryptedToken;
            Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
            const response = await Axios.post('http://localhost:3000/users/usr-img', data);
            return response; // Return the response 
        }
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default sendUsrImgDb;
