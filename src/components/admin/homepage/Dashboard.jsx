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
import userIcon from '../../../assets/user-profile.svg';
import { Link } from "react-router-dom";
import { generateNonce } from "../../../generate-nonce/nonce";

const AdminDashboard = () => {
    const csrfToken = useCsrf()
    // Image url from the back
    const imgUrl = 'http://localhost:3000/assets';
    const userData = useUserData();
    const [userInfo, setUserInfo] = useState()
    const connectedUsersId = DisplayUsersToAdminBackoffice()
    const [allUsersList, setAllUsersList] = useState(null);
    const nonce = generateNonce()

    useEffect(() => {
        if (userInfo && csrfToken) {
            async function getAllUsers(id, csrf) {
                const response = await AllUsers(id, csrf)
                console.log('All users list in dashboard:', response)
                setAllUsersList(response)
                return response;
            }
            getAllUsers(userData.user_id, csrfToken)
        }
    }, [userInfo, csrfToken]);

    useEffect(() => {
        if (connectedUsersId) {
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
                        <div className="admin-dashboard-img"><img src={userData.user_img ? `${imgUrl}/${userData.user_img}` : userIcon} alt="connected user image" /></div>
                        <div className="admin-name-container">Salut {userInfo.user_name}</div>
                    </div>}
                </div>
            </div>
            <div className="admin-dashboard-users-and-number-display-container">
                <div className="dashboard-users-container">
                    <div className="dashboard-users-section-title">Utilisateurs</div>
                    {nonce && allUsersList && allUsersList.length > 0 ? allUsersList
                        .filter(user => user.status_id != 1)
                        .map((user, index) => (
                            <Link to={`/admin/profile-utilisateur/${user.user_id}${nonce}${nonce}`} key={index} className="dashboard-users-flex">
                                <div className="dashboard-user-img-container"><img src={user.user_img ? `${imgUrl}/${user.user_img}` : userIcon} alt="user image" /></div>
                                <div className="dashboard-user-name-container" >{user.user_name}</div>
                                {connectedUsersId && connectedUsersId.includes(user.user_name) ? <div className="admin-user-connected-txt dashboard-user-connected-state">connecté</div>
                                    : <div className="admin-user-not-connected-txt dashboard-user-connected-state">non connecté</div>}
                            </Link>
                        )) : <div>No users</div>}
                </div>
                <div className="dashboard-user-count-container">
                    {allUsersList && <div className="dashboard-user-count-txt-container">
                        <div>Nombre total d'utilisateurs</div>
                        <div>{allUsersList.length + 1}</div>
                    </div>}
                    {connectedUsersId && <div className="dashboard-user-count-txt-container connected-user-count">
                        <div>Nombre d'utilisateurs connectés</div>
                        <div>{connectedUsersId.length > 0 ? connectedUsersId.length : 'Pas d\'utilisateur connecté'}</div>
                    </div>}
                </div>
                <div className="dashboard-users-container"></div>
            </div>
            <div className="admin-dashboard-listing-section">
                <div className="admin-txt">Admin</div>
                <div className="display-admin-list-container">
                    <div className="admin-listing-header-txt">
                        <div className="flex-center">Nom</div>
                        <div className="flex-center">Email</div>
                        <div className="flex-center">Status</div>
                    </div>
                    <div>
                        {allUsersList && allUsersList.length > 0 ? allUsersList
                            .filter(user => user.status_id == 1)
                            .map((user, index) => (
                                <Link to={`/admin/profile-utilisateur/${user.user_id}${nonce}${nonce}`}
                                    key={index} className={`admin-listing-body-section ${connectedUsersId.includes(user.user_name) ? 'admin-online' : 'admin-offline'}
                             ${index % 2 == 0 ? 'admin-even-count-column' : ''}`}>
                                    <div className="dashboard-admin-img-and-name">
                                        <div className="dashboard-user-img-container admin-img flex-center flex-center"><img src={user.user_img ? `${imgUrl}/${user.user_img}` : userIcon} alt="user image" /></div>
                                        <div className="flex-center">{user.user_name}</div>
                                    </div>
                                    <div className="flex-center">{user.user_email}</div>
                                    <div className="flex-center">{connectedUsersId.includes(user.user_name) ? 'connecté' : 'Pas connecté'}</div>
                                </Link>
                            ))
                            : <>{userInfo && userInfo.status_id == 1 && <div>hello</div>}</>}
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default AdminDashboard;