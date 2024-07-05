import Axios from "axios";
import retrieveEncryptedAdminToken from "../functions/GetAdminToken";

const GetAllUserFriendsData = async (userId) => {
     // Now, let's try retrieving and decrypt the stored token and userId
     const { token: decryptedToken, userId: decryptedUserId } = await retrieveEncryptedAdminToken();

    try {
        if(decryptedToken){
            Axios.defaults.headers.common['Authorization'] = decryptedToken;
            const response = await Axios.get(`http://localhost:3000/datas/user-friends-data/${userId}`);
            return response.data; // Return the response data
        }
    } catch (error) {
        console.log('Error:', error); // Log the error
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default GetAllUserFriendsData;
