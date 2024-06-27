import Axios from "axios";

const SendAdminInfo = async (credentials ) => {
    try {
        localStorage.clear();

        const response = await Axios.post(`http://localhost:3000/admin/login`, credentials);
        console.log('response:', response);

        const token = response.data.token;
        const userId = response.data.userId;
        if(token && userId){
            localStorage.setItem('token', token);
            localStorage.setItem('admin-auth', token)
            localStorage.setItem('userId', userId);
        }
        console.log('Access token from API:', token);
        console.log('Access User info from login API:', response.data);
        return token;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

export default SendAdminInfo;
