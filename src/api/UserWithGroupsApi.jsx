import Axios from "axios";

const userWithAddedGroups = async (id, csrfToken) =>{
    const token = localStorage.getItem('token');

    try {
        Axios.defaults.headers.common['Authorization'] = token;
        Axios.defaults.headers.common['CSRF-Token'] = csrfToken; // This won't work inside async function

        const response = await Axios.get(`http://localhost:3000/usergroups/userwithgroups/${id}`);
        return response; // Return the response
    } catch (error) {
        console.log('Error fetching user groups:', error);
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default userWithAddedGroups;