import '../../style/SideBarMenu.css';
import notifications from '../../assets/svg/notification.svg';
import messages from '../../assets/svg/comment-solid.svg';
import settings from '../../assets/svg/settings-solid.svg';
import aliasIcon from '../../assets/svg/earth-africa-solid.svg';


const SideBar = () => {
    return <div className='side-bar-container'>
        <div className='upper-side-bar-icon-container-flex'>
            <div className='upper-side-bar-icon-container'><img src={notifications} alt="" /></div>
            <div className='upper-side-bar-icon-container'><img src={messages} alt="" /></div>
            <div className='upper-side-bar-icon-container'><img src={settings} alt="" /></div>
        </div>
        <div className='alias-icon'>
            <img src={aliasIcon} alt="Picture of the globe oriented towards Africa" />

        </div>
    </div>
}

export default SideBar ;