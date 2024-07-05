import Axios from "axios";
import storeEncryptedAdminToken from "../functions/StoreAdminEncryptedToken";

const SendAdminInfo = async (credentials) => {
  try {
    const response = await Axios.post(`http://localhost:3000/admin/login`, credentials);
    console.log('response:', response);

    const token = response.data.token;
    const userId = response.data.userId;

    if (token && userId) {
      await storeEncryptedAdminToken(token, userId);
      localStorage.setItem('userId', userId);
      console.log('Token and UserId encrypted and stored successfully');

      return token;
    }

     return '';
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export default SendAdminInfo;
