import '../../style/SideBarMenu.css';
import notifications from '../../assets/svg/notification.svg';
import messages from '../../assets/svg/comment-solid.svg';
import settings from '../../assets/svg/settings-solid.svg';


const SideBar = () => {
    return <div>
        <div>
            <div className='upper-side-bar-icon-container'><img src={notifications} alt="" /></div>
            <div className='upper-side-bar-icon-container'><img src={messages} alt="" /></div>
            <div className='upper-side-bar-icon-container'><img src={settings} alt="" /></div>
        </div>
        <div></div>
    </div>
}

export default SideBar ;