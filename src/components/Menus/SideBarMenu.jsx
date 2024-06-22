import '../../style/SideBarMenu.css';
import messages from '../../assets/comment-solid.svg';
import settings from '../../assets/settings-solid.svg';
import aliasIcon from '../../assets/earth-africa-solid.svg';
import homeIcon from '../../assets/home-white.svg';
import handshake from '../../assets/handshake-simple-solid.svg';
import friendsIcon from '../../assets/users-solid.svg';
import groups from '../../assets/teamspeak.svg';
import logOutIcon from '../../assets/logout-solid.svg';
import communityIcon from '../../assets/community.svg';
import useUserData from '../../api/UserInfoApi';
import { useEffect, useState } from 'react';
import { Outlet, NavLink, Link, useNavigate} from 'react-router-dom';
import userWithAddedGroups from '../../api/UserWithGroupsApi';
import FourUsers from '../../api/GetOnlyFourUsersApi';
import UsersNbr from '../../api/NbrOfUsersApi';
import GetAllUserFriends from '../../api/GettingUserFriendsApi';
import GetUnreadMsg from '../../api/GetUnreadMsgAndUsersApi';
import { useCsrf } from '../../context/CsrfContext';



const SideBar = () => {
    const csrfToken = useCsrf()
    const navigate = useNavigate();
    const currentPath = window.location.pathname;
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(false); // Define loading state
    const userData = useUserData();
    const [groupNames, setGroupNames] = useState([]);
    const [userGroups, setUserGroups] = useState(null); // Define userGroups state
    const [nbrUsers, setNbrUsers] = useState(null);
    const [styleMenu, setStyleMenu] = useState('');
    const [styleMenuFriends, setStyleMenuFriends] = useState('')
    const [nbrOfFriends, setNbrOfFriends] = useState(null);
    const [unreadMsgData, setUnreadMsgData] = useState(null);

    // Image url from the back
    const imgUrl = 'http://localhost:3000/assets';

    // Get the number of users
    useEffect(() => {
        async function getUserNbr() {
            if (userId && csrfToken) {
                const response = await UsersNbr(csrfToken);
                console.log('User number', response.data.count);
                setNbrUsers(response.data.count)
            }
        }
        getUserNbr();
    }, [userId, csrfToken])

    // Get all groups linked to user
    useEffect(() => {
        async function groupRetrieve() {
            if (userId && csrfToken) {
                try {
                    const response = await userWithAddedGroups(userId, csrfToken);
                    console.log('User with added group from sidebar:', response.data)
                    setUserGroups(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching user groups:', error);
                    setLoading(false);
                }
            }
        }
        groupRetrieve();
    }, [userId, csrfToken]);
    // Get four users ordered by the most recently registered
    useEffect(() => {
        async function userRetrieve() {
            if (userId && csrfToken) {
                try {
                    const response = await FourUsers(userId, csrfToken);
                    //setUserGroups(response.data);
                } catch (error) {
                    console.error('Error fetching user groups:', error);
                }
            }
        }
        userRetrieve();
    }, [userId, csrfToken]);

    useEffect(() => {
        console.log('User data from sidebar:', userData);
    }, [userData]); // This ensures the log statement runs whenever `userData` changes

    // refresh the userId in localstorage
    useEffect(() => {
        if (userData && userData.user_id) {
            console.log('User id from sideBar: ', userData.user_id);
            localStorage.setItem('userId', userData.user_id);
        }
    }, [userData]);

    useEffect(() => {
        if (userGroups) {
            setGroupNames(userGroups.map(data => data));
        }
    }, [userGroups]);


    useEffect(() => {
        if (currentPath) {
            const styleByLocation = () => {
                if (currentPath === '/utilisateurs' || currentPath === '/admin/utilisateurs') {
                    return 'user-background-style';
                }
                return 'friends-icon-and-text-container';
            }
            setStyleMenu(styleByLocation);
        }

    }, [currentPath])
    useEffect(() => {
        if (currentPath) {
            const styleByLocation = () => {
                if (currentPath === '/amis' || currentPath === '/admin/amis') {
                    return 'friends-background-style';
                }
                return 'friends-icon-and-text-container';
            }
            setStyleMenuFriends(styleByLocation);
        }

    }, [currentPath])

    // Get user friends 
    useEffect(() => {
        if (userId && csrfToken) {
            const getfriends = async (id, csrf) => {
                const response = await GetAllUserFriends(id, csrf)
                setNbrOfFriends(response.length)
            }
            getfriends(userId, csrfToken);
        }

    }, [userId, csrfToken]);

    useEffect(() => {
        if (userId && csrfToken) {
            const getUnread = async (receiverId, csrf) => {
                const response = await GetUnreadMsg(receiverId, csrf);
                console.log('Unread msg data are:', response);
                setUnreadMsgData(response);
            }
            getUnread(userId, csrfToken)
        }
    }, [userId, csrfToken]);

    // Disconnect user
    function disconnectUser() {
        localStorage.clear();
        navigate('/');

    }
    // Check if userData is not null before accessing its properties
    if (userData) {
        return (<>

            <div className='side-bar-container'>
                <header>
                    <nav>
                        <div className='upper-side-bar-icon-container-flex'>
                            <NavLink to='/accueil' className='upper-side-bar-icon-container'>
                                <img src={homeIcon} alt="" />
                            </NavLink>
                            <NavLink className='upper-side-bar-icon-container' to='/messages-non-lus'>
                                {unreadMsgData && unreadMsgData != 'No unread message found' && <div className='unread-msg-count-container'>{unreadMsgData.length}</div>}
                                <img src={messages} alt="" className='msg-img' />
                            </NavLink>
                            <NavLink  to='/parametre' className='upper-side-bar-icon-container'><img src={settings} alt="" /></NavLink>
                        </div>
                        <div className='alias-icon-container'>
                            {!userData.user_img || !userData.show_user_image ? <div className='alias-icon'>
                                <img src={aliasIcon} alt="Picture of the globe oriented towards Africa" />
                            </div> :
                            <div className='alias-icon sidebar-user-img'>
                                <img src={`${imgUrl}/${userData.user_img}`} alt="connected user image" />
                            </div>}
                        </div>
                        <div className='greetings-container'>
                            <div className='handshake-icon-container'>
                                <div className='handshake-icon'>
                                    <img src={handshake} alt="Welcom image showing a handshake" />
                                </div>
                            </div>
                            <div className='welcom-text-container'>
                                <p className='user-welcom-text'>Salut {userData.user_name}</p>
                            </div>
                        </div>
                        <div className='flex-sidebar-lower-items'>
                            <div className='sidebar-menus-container'>
                                <div className='sidebar-users-section'>
                                    {styleMenu && <Link to='/utilisateurs' className={styleMenu}>
                                        <div className='community-icon'>
                                            <img src={communityIcon} alt="community icon" />
                                        </div>
                                        <div className='connected-freinds-container'>
                                            <p className='connected-freinds-text'>Utilisateurs</p>
                                        </div>
                                        {<div className='users-total-nbr-container'>
                                            <p>{nbrUsers}</p>
                                        </div>}
                                    </Link>

                                    }
                                </div>
                                <div className='sidebar-users-section'>
                                    {styleMenu && <Link to='/amis' className={styleMenuFriends}>
                                        <div className='community-icon'>
                                            <img src={friendsIcon} alt="community icon" />
                                        </div>
                                        <div className='connected-freinds-container'>
                                            <p className='connected-freinds-text'>Liste des amis</p>
                                        </div>
                                        {<div className='users-total-nbr-container'>
                                            <p>{nbrOfFriends}</p>
                                        </div>}
                                    </Link>

                                    }
                                </div>
                                <div className='groups-icon-and-text-container'>
                                    <div className='friends-icon'>
                                        <img src={groups} alt="" />
                                    </div>
                                    <div className='connected-freinds-container'>
                                        <p className='connected-freinds-text'>Groupes membre</p>
                                    </div>
                                </div>
                                <div className='mt-3'>
                                    {loading ? <div>Loading...</div> : groupNames.map((groupName, index) => (
                                        <div key={index}>
                                            {groupName.group_name ? (!groupName.user_quit_group && <div className='text-center group-names-container'>
                                                <NavLink key={index} className='navlink'
                                                    to={`/${groupName.group_name.toLowerCase().replace(/ /g, '-')}/${groupName.group_id}${groupName.group_uuid}`}>
                                                    <p>{groupName.group_name}</p>
                                                </NavLink>
                                            </div>) : <div className='text-center group-names-container' >Aucun group</div>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='friends-icon-and-text-container disconnect-container' onClick={disconnectUser}>
                                <div className='friends-icon'>
                                    <img src={logOutIcon} alt="" />
                                </div>
                                <div className='connected-freinds-container'>
                                    <p className='connected-freinds-text'>Se déconnecter</p>
                                </div>
                            </div>
                        </div>
                    </nav>
                </header>
            </div>
            <div>
                <Outlet />
            </div>
        </>


        );
    } else {
        return <div>Loading...</div>;
    }
}

export default SideBar;