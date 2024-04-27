import '../../style/SideBarMenu.css';
import notifications from '../../assets/svg/notification.svg';
import messages from '../../assets/svg/comment-solid.svg';
import settings from '../../assets/svg/settings-solid.svg';
import aliasIcon from '../../assets/svg/earth-africa-solid.svg';
import handshake from '../../assets/svg/handshake-simple-solid.svg';
import friendsIcon from '../../assets/svg/users-solid.svg';
import groups from '../../assets/svg/teamspeak.svg';
import logOutIcon from '../../assets/svg/logout-solid.svg';
import communityIcon from '../../assets/svg/community.svg';
import useUserData from '../../api/UserInfoApi';
import { useEffect, useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import UserWithAddedGroups from '../../api/UserWithGroupsApi';
import FourUsers from '../../api/GetOnlyFourUsersApi';
import UsersNbr from '../../api/NbrOfUsersApi';



const SideBar = () => {
    const location = useLocation();
    const currentPath = window.location.pathname;
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(false); // Define loading state
    const userData = useUserData();
    const [groupNames, setGroupNames] = useState([]);
    const [userGroups, setUserGroups] = useState(null); // Define userGroups state
    const [users, setUsers] = useState([]);
    const [usersData, setUsersData] = useState(null);
    const [nbrUsers, setNbrUsers] = useState(null);
    const [styleMenu, setStyleMenu] = useState('');
    // Get the number of users
    useEffect(() => {
        async function getUserNbr() {
            if (userId) {
                const response = await UsersNbr();
                console.log('User number', response.data.count);
                setNbrUsers(response.data.count)
            }
        }
        getUserNbr();
    }, [userId])

    // Get all groups linked to user
    useEffect(() => {
        async function groupRetrieve() {
            if (userId) {
                try {
                    const response = await UserWithAddedGroups(userId);
                    setUserGroups(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching user groups:', error);
                    setLoading(false);
                }
            }
        }
        groupRetrieve();
    }, [userId]);
    // Get four users ordered by the most recently registered
    useEffect(() => {
        async function userRetrieve() {
            if (userId) {
                try {
                    const response = await FourUsers(userId);
                    setUsersData(response.data)
                    console.log('Users listing: ', response.data);
                    //setUserGroups(response.data);
                } catch (error) {
                    console.error('Error fetching user groups:', error);
                }
            }
        }
        userRetrieve();
    }, [userId]);

    useEffect(() => {
        console.log(userData);
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
        if (usersData) {
            setUsers(usersData.map(data => data));
        }
    }, [usersData]);

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

    const handleNavClick = () => {
        // Set the timeout and store the timeout ID
        const timeoutId = setTimeout(() => {
            window.location.reload(); // Reload the window after a small delay
        }, 60); // Adjust the delay time as needed
        
        // Clear the timeout if the component unmounts or the user navigates away
        return () => clearTimeout(timeoutId);
    };
    

    // Check if userData is not null before accessing its properties
    if (userData) {
        return (<>
            <div className='side-bar-container'>
                <header>
                    <nav>
                        <div className='upper-side-bar-icon-container-flex'>
                            <div className='upper-side-bar-icon-container'><img src={notifications} alt="" /></div>
                            <div className='upper-side-bar-icon-container'><img src={messages} alt="" /></div>
                            <div className='upper-side-bar-icon-container'><img src={settings} alt="" /></div>
                        </div>
                        <div className='alias-icon-container'>
                            <div className='alias-icon'>
                                <img src={aliasIcon} alt="Picture of the globe oriented towards Africa" />
                            </div>
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
                                        {nbrUsers && <div className='users-total-nbr-container'>
                                            <p>{nbrUsers}</p>
                                        </div>}
                                    </Link>

                                    }
                                </div>
                                <div className='friends-icon-and-text-container'>
                                    <div className='friends-icon'>
                                        <img src={friendsIcon} alt="Friends icon" />
                                    </div>
                                    <div className='connected-freinds-container'>
                                        <p className='connected-freinds-text'>Tes amis/amies</p>
                                    </div>
                                </div>
                                <div className='friends-icon-and-text-container'>
                                    <div className='friends-icon'>
                                        <img src={groups} alt="" />
                                    </div>
                                    <div className='connected-freinds-container'>
                                        <p className='connected-freinds-text'>Tes Groupes membre</p>
                                    </div>
                                </div>
                                <div className='mt-3'>
                                    {loading ? <div>Loading...</div> : groupNames.map((groupName, index) => (
                                        <div className='text-center group-names-container' key={index}>
                                            <NavLink key={index} className='navlink'
                                                to={`/${groupName.group_name.toLowerCase().replace(/ /g, '-')}/${groupName.group_id}`}
                                                onClick={handleNavClick}>
                                                <p>{groupName.group_name}</p>
                                            </NavLink>
                                        </div>
                                    ))}

                                    {userGroups && userGroups.length === 0 && <div>Aucun group</div>}
                                </div>
                            </div>

                            <div className='friends-icon-and-text-container'>
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