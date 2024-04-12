import Axios from "axios";

const PostUserInfo = async(registrationFormData) => {
    return await Axios.post('http://localhost:3000/users/', registrationFormData);
}

export default PostUserInfo;