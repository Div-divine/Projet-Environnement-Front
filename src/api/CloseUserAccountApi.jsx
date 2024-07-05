import Axios from "axios";
import retrieveEncryptedAdminToken from "../functions/GetAdminToken";

const closeAccount = async (csrfToken, userId, data = null) => {
    // Now, let's try retrieving and decrypt the stored token and userId
    const { token: decryptedToken, userId: decryptedUserId } = await retrieveEncryptedAdminToken();

    try {
        if (decryptedToken) {
            Axios.defaults.headers.common['Authorization'] = decryptedToken;
            Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
            const response = await Axios.put(`http://localhost:3000/users/delete-usr-account/${userId}`, data);
            return response.status; // Return the response data
        }
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default closeAccount;
