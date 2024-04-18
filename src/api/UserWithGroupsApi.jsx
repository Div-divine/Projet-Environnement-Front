import Axios from "axios";

const UserWithAddedGroups = async (id) =>{
    const token = localStorage.getItem('token');
    try {
        Axios.defaults.headers.common['Authorization'] = token;
        const response = await Axios.get('http://localhost:3000/usergroups/userwithgroups', { params: { userId: id } });

        return response; // Return the response data
    } catch (error) {
        console.log('Error:', error) ; // Rethrow error to propagate it to the caller
    }
}

export default UserWithAddedGroups;