import AdminSidebar from "../menus/AdminSidebar";
import '../../../style/admin-homepage.css';
import useUserData from "../../../api/UserInfoApi";
import { useEffect, useState } from "react";
import notificationIcon from '../../../assets/admin-notif.svg'
import circleIcon from '../../../assets/red-circle.svg'
import msgIcon from '../../../assets/admin-msg.svg'
import { DisplayUsersToAdminBackoffice } from "../connected-users/ConnectedUsersId";
import AllUsers from "../../../api/GetAllUsersApi";
import { useCsrf } from "../../../context/CsrfContext";

const AdminDashboard = () => {
    const csrfToken = useCsrf()
    // Image url from the back
    const imgUrl = 'http://localhost:3000/assets';
    const userData = useUserData();
    const [userInfo, setUserInfo] = useState()
    const connectedUsersId = DisplayUsersToAdminBackoffice()

    useEffect(()=>{
        if(userInfo && csrfToken){
            async function getAllUsers( id, csrf ){
                const response = await AllUsers(id, csrf)
                console.log('All users list in dashboard:', response)
                return response;
            }
            getAllUsers(userData.user_id, csrfToken)
        }
    }, [userInfo, csrfToken]);

    useEffect(()=>{
        if(connectedUsersId){
            console.log('Conected users name:', connectedUsersId)
        }
    }, [connectedUsersId])

    useEffect(() => {
        console.log('User data from dashboard:', userData)
        setUserInfo(userData);
    }, [userData]);

    return <div className="admin-dashboard-main-container">
        <AdminSidebar />
        <div className="admin-dashboard-container">
            <div className="admin-upper-icon-and-profile-container">
                <div className="admin-notif-and-msg-icon-container">
                    <div className="admin-notif-and-msg-icon-children-container">
                        <div>
                            <div className="admin-sidebar-circle-container"><img src={circleIcon} alt="red circle" /></div>
                            <div className="admin-sidebar-notif-container"><img src={notificationIcon} alt="Notification" /></div>
                        </div>
                    </div>
                    <div className="admin-notif-and-msg-icon-children-container">
                        <div>
                            <div className="admin-sidebar-circle-container"><img src={circleIcon} alt="red circle" /></div>
                            <div className="admin-sidebar-notif-container"><img src={msgIcon} alt="Notification" /></div>
                        </div>
                    </div>
                </div>
                <div className="admin-dashboard-profile-section">
                    {userInfo && <div>
                        <div className="admin-dashboard-img"><img src={`${imgUrl}/${userData.user_img}`} alt="connected user image" /></div>
                        <div className="admin-name-container">Salut {userInfo.user_name}</div>
                    </div>}
                </div>
            </div>
        </div>
    </div>
}

export default AdminDashboard;