import Axios from "axios";
import retrieveEncryptedAdminToken from "../functions/GetAdminToken";

const userWithAddedGroups = async (id, csrfToken) => {
    // Now, let's try retrieving and decrypt the stored token and userId
    const { token: decryptedToken, userId: decryptedUserId } = await retrieveEncryptedAdminToken();

    try {
        if (decryptedToken) {
            Axios.defaults.headers.common['Authorization'] = decryptedToken;
            Axios.defaults.headers.common['CSRF-Token'] = csrfToken; // This won't work inside async function

            const response = await Axios.get(`http://localhost:3000/usergroups/userwithgroups/${id}`);
            return response; // Return the response
        }
    } catch (error) {
        console.log('Error fetching user groups:', error);
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default userWithAddedGroups;