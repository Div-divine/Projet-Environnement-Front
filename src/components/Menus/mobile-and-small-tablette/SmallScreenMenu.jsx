import '../../../style/small-screen-menu.css'
import logo from '../../../assets/logo-site-environnement.png';
import { useLocation, Link } from 'react-router-dom';

const SmallMenu = ({ menuHandler }) => {
    const location = useLocation();

    const redirectHomePage = () => {
        return window.location.href = '/'
    }

    return <div className='small-menu-upper-container'>
        <div className='small-menu-container' onClick={menuHandler}>
            <div>
                <div className='small-menu-icon-container '>
                    <i className="fa-solid fa-bars" />
                </div>
                <div className='menu-text-container'>Menu</div>
            </div>
        </div>
        <div className='logo-container'>
            <div className='logo'>
                <img src={logo} alt="logo" onClick={redirectHomePage} />
            </div>
            <div className='logo-text' onClick={redirectHomePage} >EcoConscience</div>
        </div>
        <Link className='menu-user-profil-icon' to='/connexion'><i className="fa-regular fa-user" /></Link>
    </div>
}

export default SmallMenu;