import '../../../style/open-small-menu.css';
import logo from '../../../assets/images/logo-site-environnement.png';

const HamburgerMenu = ({ closeMenu }) => {
    return <div className='burger-menu-container'>
        <div className='close-and-scan-icons-container'>
            <div className='close-open-menu-container'>
                <div className='close-icon center-items' onClick={closeMenu}>
                    <i className="fa-solid fa-xmark"></i>
                </div>
                <div className='close-menu-txt center-items' onClick={closeMenu}>Fermer</div>
            </div>
        </div>
        <div className='center-items open-menu-items-container'>
            <div className='logo-timeo-container-open-menu'><img src={logo} alt="Timeo logo" /></div>
            <div className='connect-btn'><input type="button" value="Se connecter" /></div>
            <div className='create-account-btn'><input type="button" value="Créer un compte" /></div>
        </div>
    </div>
}

export default HamburgerMenu;