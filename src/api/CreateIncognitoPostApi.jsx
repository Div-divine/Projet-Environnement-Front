import Axios from "axios";
import retrieveEncryptedAdminToken from "../functions/GetAdminToken";

const insertUserPostIncognito = async (userPostAndGroup, csrfToken) => {
    // Now, let's try retrieving and decrypt the stored token and userId
    const { token: decryptedToken, userId: decryptedUserId } = await retrieveEncryptedAdminToken();

    try {
        if (decryptedToken) {
            Axios.defaults.headers.common['Authorization'] = decryptedToken;
            // Set CSRF token in headers
            Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
            const response = await Axios.post('http://localhost:3000/posts/incognito', userPostAndGroup);
            return response.data; // Return the response data
        }
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default insertUserPostIncognito;
