import Axios from "axios";
import retrieveEncryptedAdminToken from "../functions/GetAdminToken";

const UserWithGroups = async (data, csrfToken) => {
    // Now, let's try retrieving and decrypt the stored token and userId
    const { token: decryptedToken, userId: decryptedUserId } = await retrieveEncryptedAdminToken();

    try {
        if(decryptedToken){
            Axios.defaults.headers.common['Authorization'] = decryptedToken;
            // Set CSRF-Token header for request
            Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
            
            const response = await Axios.post('http://localhost:3000/usergroups/', data);
            return response; // Return the response data
        }
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default UserWithGroups;