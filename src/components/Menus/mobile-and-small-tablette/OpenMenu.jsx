import '../../../style/open-small-menu.css';
import logo from '../../../assets/logo-site-environnement.png';
import { useLocation, Link } from 'react-router-dom';

const HamburgerMenu = ({ closeMenu }) => {

    const location = useLocation();

    const redirectHomePage = () => {
        return window.location.href = '/'
    }

    // Remove open menu because it is positioned on top of other elements 
    function removeOpenMenu(e){
        const burgerMenu = getElementByClassName('burger-menu-container')
        burgerMenu.style.display = 'none';
    }

    return <div className='burger-menu-container'>
        <div className='close-menu-container'>
            <div className='close-menu-icon' onClick={closeMenu}>
                <i className="fa-solid fa-xmark"></i>
            </div>
            <div className='close-menu-txt' onClick={closeMenu}>Fermer</div>
        </div>
        <div className='opened_menu-logo-and-btns-container'>
            <div className='logo-container opened-menu-logo-container'>
                <div className='logo'>
                    <img src={logo} alt="logo" onClick={redirectHomePage}/>
                </div>
                <div className='logo-text' onClick={redirectHomePage}>EcoConscience</div>
            </div>
            <div className='opened-menu-btns-container'>
                <Link className='connect-btn' onClick={(e)=>removeOpenMenu(e.target.clicked)} to='/connexion'><input type="button" value="Se connecter" /></Link>
                <Link className='create-account-btn' onClick={(e)=>removeOpenMenu(e.target.clicked)} to='/inscription'><input type="button" value="Créer un compte" /></Link>
            </div>
        </div>
    </div>
}

export default HamburgerMenu;