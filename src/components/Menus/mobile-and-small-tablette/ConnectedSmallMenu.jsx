import messages from '../../../assets/comment-solid.svg';
import settings from '../../../assets/settings-solid.svg';
import homeIcon from '../../../assets/home-white.svg';
import friendsIcon from '../../../assets/users-solid.svg';
import groups from '../../../assets/teamspeak.svg';
import communityIcon from '../../../assets/community.svg';
import '../../../style/connected-small-screen-menu.css';
import GetUnreadMsg from '../../../api/GetUnreadMsgAndUsersApi';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useCsrf } from '../../../context/CsrfContext';

const ConnectedUserSmallScreenMenu = ({ menuHandler }) => {
    const csrfToken = useCsrf()
    const userId = localStorage.getItem('userId');
    const [unreadMsgData, setUnreadMsgData] = useState(null);
    useEffect(() => {
        if (userId && csrfToken) {
            const getUnread = async (receiverId, csrf) => {
                const response = await GetUnreadMsg(receiverId, csrf);
                setUnreadMsgData(response);
            }
            getUnread(userId, csrfToken)
        }
    }, [userId, csrfToken]);



    return (<>
        <div className='connected-small-menu-upper-container'>
            <header>
                <nav>
                    <div className='connected-small-screen-menu-container'>
                        <NavLink to='/accueil' className='connected-small-screen-home-icon-container'><img src={homeIcon} alt="home icon" /></NavLink>
                        <div className='connected-small-screen-other-icons-container'>
                            <div><NavLink to='/messages-non-lus' className='connected-container'><span className='connected-icons-container'><img src={messages} alt="mesage icon" /></span>{unreadMsgData && unreadMsgData != 'No unread message found' && <span className='connected-menu-text connected-unread-msg-count-container' />}</NavLink></div>
                            <div><NavLink to='/amis' className='connected-container'><span className='connected-icons-container'><img src={friendsIcon} alt="friends icon" /></span></NavLink></div>
                            <div><NavLink to='/utilisateurs' className='connected-container' ><span className='connected-icons-container'><img src={communityIcon} alt="community icon" /></span></NavLink></div>
                            <div className='connected-container' onClick={menuHandler}><span className='connected-icons-container'><img src={groups} alt="groups icon" /></span></div>
                        </div>
                        <div></div><NavLink to='/parametre' className='connected-small-screen-setting-icon-container'><img src={settings} alt="setting icon" /></NavLink>
                    </div>
                </nav>
            </header>
        </div>
    </>)
}

export default ConnectedUserSmallScreenMenu;