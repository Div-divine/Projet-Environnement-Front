import { useParams } from "react-router-dom";

const DisplayUserProfile = () =>{

    const { id } = useParams();
    // Extracting user ID by removing nonce
    const userId = +id.slice(0, -72);
    if (userId) {
        console.log('User id gotten from params by slicing:', userId);
    }
    return <>User profile page</>;
}

export default DisplayUserProfile;