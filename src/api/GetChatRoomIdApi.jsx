import Axios from "axios";
import retrieveEncryptedAdminToken from "../functions/GetAdminToken";

const chatRoomId = async (user1, user2, csrfToken) => {
    // Now, let's try retrieving and decrypt the stored token and userId
    const { token: decryptedToken, userId: decryptedUserId } = await retrieveEncryptedAdminToken();

    try {
        if (decryptedToken) {
            Axios.defaults.headers.common['Authorization'] = decryptedToken;
            // Set CSRF token in headers
            Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
            const response = await Axios.get(`http://localhost:3000/chatroom/chatroom-id/${user1}/${user2}`);
            return response.data; // Return the response data
        }
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default chatRoomId;
