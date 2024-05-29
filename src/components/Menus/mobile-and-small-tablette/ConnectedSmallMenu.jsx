import messages from '../../../assets/svg/comment-solid.svg';
import settings from '../../../assets/svg/settings-solid.svg';
import homeIcon from '../../../assets/svg/home-white.svg';
import friendsIcon from '../../../assets/svg/users-solid.svg';
import groups from '../../../assets/svg/teamspeak.svg';
import communityIcon from '../../../assets/svg/community.svg';
import '../../../style/connected-small-screen-menu.css';
import GetUnreadMsg from '../../../api/GetUnreadMsgAndUsersApi';
import { useState, useEffect } from 'react';

const ConnectedUserSmallScreenMenu = ({ menuHandler }) => {
    const userId = localStorage.getItem('userId');
    const [unreadMsgData, setUnreadMsgData] = useState(null);
    useEffect(() => {
        if (userId) {
            const getUnread = async (receiverId) => {
                const response = await GetUnreadMsg(receiverId);
                setUnreadMsgData(response);
            }
            getUnread(userId)
        }
    }, [userId]);

    function redirectHome(){
        return window.location.href = '/accueil'
    }
    function redirectMsg(){
        return window.location.href = '/messages-non-lus'
    }
    function redirectFriends(){
        return window.location.href = '/amis'
    }
    function redirectUsers(){
        return window.location.href = '/utilisateurs'
    }

    return (<>
        <div className='connected-small-menu-upper-container'>
            <header>
                <nav>
                    <div className='connected-small-screen-menu-container'>
                        <div className='connected-small-screen-home-icon-container' onClick={redirectHome}><img src={homeIcon} alt="home icon" /></div>
                        <div className='connected-small-screen-other-icons-container'>
                            <div className='connected-container' onClick={redirectMsg}><span className='connected-icons-container'><img src={messages} alt="mesage icon" /></span>{unreadMsgData && unreadMsgData.length > 0 && <span className='connected-menu-text connected-unread-msg-count-container'/>}</div>
                            <div className='connected-container' onClick={redirectFriends}><span className='connected-icons-container'><img src={friendsIcon} alt="friends icon" /></span></div>
                            <div className='connected-container' onClick={redirectUsers}><span className='connected-icons-container'><img src={communityIcon} alt="community icon" /></span></div>
                            <div className='connected-container' onClick={menuHandler}><span className='connected-icons-container'><img src={groups} alt="groups icon" /></span></div>
                        </div>
                        <div className='connected-small-screen-setting-icon-container'><img src={settings} alt="setting icon" /></div>
                    </div>
                </nav>
            </header>
        </div>
    </>)
}

export default ConnectedUserSmallScreenMenu;