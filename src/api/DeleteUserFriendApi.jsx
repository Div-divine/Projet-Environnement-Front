import Axios from "axios";
import retrieveEncryptedAdminToken from "../functions/GetAdminToken";

const deleteFriends = async (user1Id, user2Id, csrfToken) => {
    // Now, let's try retrieving and decrypt the stored token and userId
    const { token: decryptedToken, userId: decryptedUserId } = await retrieveEncryptedAdminToken();

    try {
        if (decryptedToken) {
            Axios.defaults.headers.common['Authorization'] = decryptedToken;
            // Set CSRF token in headers
            Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
            const response = await Axios.delete(`http://localhost:3000/friends/${user1Id}/${user2Id}`);
            return response; // Return the response data
        }
    } catch (error) {
        console.log('Error:', error); // Log the error
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default deleteFriends;
