import Axios from "axios";
import { useEffect } from "react";

const UserWithGroups = async (data) =>{
    const token = localStorage.getItem('token');
    try {
        Axios.defaults.headers.common['Authorization'] = token;
        const response = await Axios.post('http://localhost:3000/usergroups/', data);
        return response; // Return the response data
    } catch (error) {
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default UserWithGroups;