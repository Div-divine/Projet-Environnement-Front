import '../../style/SideBarMenu.css';
import notifications from '../../assets/svg/notification.svg';
import messages from '../../assets/svg/comment-solid.svg';
import settings from '../../assets/svg/settings-solid.svg';
import aliasIcon from '../../assets/svg/earth-africa-solid.svg';
import handshake from '../../assets/svg/handshake-simple-solid.svg';
import friendsIcon from '../../assets/svg/users-solid.svg';
import groups from '../../assets/svg/teamspeak.svg';
import logOutIcon from '../../assets/svg/logout-solid.svg';
import useUserData from '../../api/UserInfoApi';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import UserWithAddedGroups from '../../api/UserWithGroupsApi';



const SideBar = () => {

    const userData = useUserData();
    const [userGroups, setUserGroups] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            if (userData) {
                try {

                    const id = userData.user_id;
                    const response = await UserWithAddedGroups(id);
                    setUserGroups(response.data);
                } catch (error) {
                    console.error('Error fetching user with groups:', error);
                }
            }
        };

        fetchData();
    }, [userData]); // This ensures the log statement runs whenever `userData` changes
    // Check if userData is null before accessing its properties
    if (userData) {
        console.log('User groups are:', userGroups);
        //console.log('User datas are:', userData)
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
                        <div className='friends-icon-and-text-container'>
                            <div className='friends-icon'>
                                <img src={friendsIcon} alt="Friends icon" />
                            </div>
                            <div className='connected-freinds-container'>
                                <p className='connected-freinds-text'>Amis connectés</p>
                            </div>
                        </div>
                        <div className='most-recents-text-container'>
                            <p className='most-recents-text'>Les plus récents</p>
                        </div>
                        <div className='most-recents-text-container'>
                            <p className='most-recents-text'>Tout lister</p>
                        </div>
                        <div className='friends-icon-and-text-container'>
                            <div className='friends-icon'>
                                <img src={groups} alt="" />
                            </div>
                            <div className='connected-freinds-container'>
                                <p className='connected-freinds-text'>Groupes membre</p>
                            </div>
                        </div>
                        <div>
                            {userGroups && userGroups.map((data) => (
                                <div key={data.group_name} className='mb-2'>
                                    <p>{data.group_name}</p>
                                </div>
                            ))}
                            {userGroups && userGroups.length === 0 && <div>Aucun group</div>}
                        </div>

                        <div className='friends-icon-and-text-container'>
                            <div className='friends-icon'>
                                <img src={logOutIcon} alt="" />
                            </div>
                            <div className='connected-freinds-container'>
                                <p className='connected-freinds-text'>Se déconnecter</p>
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