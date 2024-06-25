import { useParams } from "react-router-dom";
import AdminSidebar from "../menus/AdminSidebar";
import GetAllUserFriendsData from "../../../api/GetUserFriendsDataApi";
import { useEffect, useState } from "react";
import JoinAllGroupsToUsers from "../../../api/ListAllJoinUserWithGroupsApi";
import { useCsrf } from "../../../context/CsrfContext";
import userIcon from '../../../assets/user-profile.svg';
import messageIcon from '../../../assets/white-message.svg';
import EmailIcon from '../../../assets/white-envelope.svg';
import '../../../style/admin-user-profile-page.css';
import CustomModal from "../../modalbox/CustomModalBox";
import DeleteUserImg from "../../../api/DeleteUserImgApi";
import closeAccount from "../../../api/CloseUserAccountApi";

const DisplayUserProfile = () => {
    const csrfToken = useCsrf()
    const { id } = useParams();
    const userId = localStorage.getItem('userId');
    const [userGroups, setUserGroups] = useState([]);
    const [friendsData, setFriendsData] = useState(null);
    const userIdSSelected = +id.slice(0, -72);  // Extracting user ID by removing nonce
    const [userProfileId, setUserProfileId] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clickedUserId, setClickedUserId] = useState(null)
    const [unauthaurizedNotif, setUnauthaurizedNotif] = useState(false);
    const [accountClosedMsg, setAccountClosedMsg] = useState(false);

    const imgUrl = 'http://localhost:3000/assets';

    useEffect(() => {
        if (userId && csrfToken) {
            async function fetchData() {
                try {
                    const response = await JoinAllGroupsToUsers(userId, csrfToken);
                    const usersWithStatus = response.data.map(user => ({
                        ...user
                    }));
                    console.log('User datas from admin users:', usersWithStatus)
                    setUserGroups(usersWithStatus);
                } catch (error) {
                    console.error("Error fetching user groups:", error);
                }
            }

            fetchData();
        }
    }, [userId, csrfToken]);

    useEffect(() => {
        if (userIdSSelected) {
            setUserProfileId(userIdSSelected)
        }
    }, [userIdSSelected])

    useEffect(() => {
        if (userProfileId) {
            const getFriends = async (id, csrf) => {
                const response = await GetAllUserFriendsData(id);
                console.log('User friends Data from profile:', response);
                setFriendsData(response);
            };
            getFriends(userProfileId);
        }
    }, [userProfileId]);

    useEffect(() => {
        if (friendsData && userGroups && userProfileId) {
            console.log('Friend data 2:', friendsData)
            console.log('User groups:', userGroups.filter(user => user.user.user_id == userProfileId))
        }
    }, [friendsData, userGroups, userProfileId])

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleDeleteClick = (userId) => {
        setClickedUserId(userId);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (userId && clickedUserId && csrfToken) {
            try {
                const data = { userRoleId: userId }
                // Delete user image first from server because user image name to delete from server is queried from the database 
                await DeleteUserImg(csrfToken, clickedUserId, data);
                await closeAccount(csrfToken, clickedUserId, data)
                setIsModalOpen(false);
                setAccountClosedMsg(true);
            } catch (error) {
                console.error('Error deleting friend:', error);
                if (error.response.status == 401) {
                    setUnauthaurizedNotif(true)
                }
            }
        }
        return;
    }

    useEffect(() => {
        if (userGroups.length > 0 && userProfileId) {
            userGroups
                .filter(user => user.user.user_id == userProfileId)
                .map((user) => {
                    if (user.user.user_name == 'Compte clôturé!') {
                        setAccountClosedMsg(true);
                    }
                })
        }
    }, [userGroups, userProfileId]);

    return <div className="admin-dashboard-main-container">
        <AdminSidebar />
        <main className="admin-dashboard-container flex-center">
            {accountClosedMsg && <div className="delete-usr-success-msg flex-center">Compte utilisateur clôturé!</div>}
            {unauthaurizedNotif && <div className="delete-usr-unautorized-msg flex-center">Vous n'êtes pas autorisé de supprimer ce compte utilisateur!</div>}
            {!accountClosedMsg && <div className="user-profile-upper-conatiner">
                {userProfileId && userGroups
                    .filter(user => user.user.user_id == userProfileId)
                    .map((user, index) => (
                        <div key={index} >
                            <div className="user-profile-section-img-conatiner"><img src={user.user.user_img ? `${imgUrl}/${user.user.user_img}` : userIcon} alt="user image" /></div>
                            <div className="user-profile-section-icons-container flex-wrap">
                                <div><img src={messageIcon} alt="message icon" /></div>
                                <div><img src={EmailIcon} alt="envolope icon" /></div>
                            </div>
                            {user.user.status_id != 3 ? <div className="">
                                <div className="group-mbr-titlle">Groupes Membre</div>
                                <div className="group-mbr-txt-container">
                                    {user.groups.map(group => (
                                        <div key={group.group_id} className="group-mbr-txt txt-elem">- {group.group_name}</div>
                                    ))}
                                    {/* If user has no groups, display a message */}
                                    {user.groups.length === 0 && <div className="txt-elem">- Aucun group membre</div>}
                                </div>
                            </div> : ''}
                            <div className="flex-wrap-center usr-name-and-emeil-in-profile">
                                <div>
                                    <div className="flex-center name-title">Nom</div>
                                    <div className="flex-center txt-elem">{user.user.user_name}</div>
                                </div>
                                <div>
                                    <div className="flex-center name-title">Email</div>
                                    <div className="txt-elem">{user.user.user_email}</div>
                                </div>
                            </div>

                        </div>
                    ))}
                <div className="friends-img-section">
                    <div className="friends-title name-title">Liste d'amis</div>
                    <div className="flex-start">
                        {friendsData && friendsData.length > 0 ? friendsData.map((friend, index) => (
                            <div key={index} className="user-profile-friends-img-container">
                                <img src={friend.friend_img ? `${imgUrl}/${friend.friend_img}` : userIcon} alt="" />
                            </div>
                        )) : <div className="txt-elem">- Aucun ami pour l'instant</div>
                        }
                    </div>
                </div>
                {userProfileId && userGroups
                    .filter(user => user.user.user_id == userProfileId)
                    .map((user, index) => (
                        <div key={index}>
                            {user.user.status_id == 3 ? <div className="super-admin-text-div-profile flex-center">Profile super admin🫡</div>
                                : <div className="delete-usr-div flex-center"
                                    onClick={() => handleDeleteClick(user.user.user_id)}>Supprimer le compte utilisateur</div>}
                        </div>
                    ))
                }
            </div>}
        </main>
        {isModalOpen && clickedUserId && (
            <CustomModal
                title="Supprimer ce compte utilisateur"
                message="Confirmer ?"
                buttonText="Supprimer"
                onClose={handleCloseModal}
                onButtonClick={handleConfirmDelete}
            />
        )}
    </div>;
}

export default DisplayUserProfile;