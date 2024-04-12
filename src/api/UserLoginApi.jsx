import Axios from "axios";

const SendUserInfo = async (credentials) => { // Remove the object destructuring
    try {
        // Send POST request to /login endpoint with user credentials
        const response = await Axios.post('http://localhost:3000/users/login', credentials);
        console.log('response:', response);
        // Extract the token from the response
        const token = response.data.token; // Assuming the token is stored in data
        console.log('Access token:', token);
        return token; // Return the token
    } catch (error) {
        // Handle errors (e.g., invalid credentials, server errors)
        console.error('Error logging in:', error);
        throw error; // Propagate the error to the caller
    }
}

export default SendUserInfo;
