import Axios from "axios";
import retrieveEncryptedAdminToken from "../functions/GetAdminToken";

const updateUserComment = async (commentId, userId, updateContent, csrfToken) => {
     // Now, let's try retrieving and decrypt the stored token and userId
     const { token: decryptedToken, userId: decryptedUserId } = await retrieveEncryptedAdminToken();

    try {
        if(decryptedToken){
            Axios.defaults.headers.common['Authorization'] = decryptedToken;
            Axios.defaults.headers.common['CSRF-Token'] = csrfToken;
            const response = await Axios.put(`http://localhost:3000/posts/comment/${commentId}/${userId}`, updateContent);
            return response.data; // Return the response data
        }
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default updateUserComment;
