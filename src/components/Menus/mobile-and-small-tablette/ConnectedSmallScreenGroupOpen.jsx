import '../../../style/open-small-menu.css';
import logo from '../../../assets/logo-site-environnement.png';
import { useNavigate, NavLink } from 'react-router-dom';
import userWithAddedGroups from '../../../api/UserWithGroupsApi';
import { useState, useEffect } from 'react';
import { useCsrf } from '../../../context/CsrfContext';

const SmallScreenOpenGroup = ({ closeMenu }) => {
    const csrfToken = useCsrf()
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId')
    const [groupNames, setGroupNames] = useState([]);
    const [userGroups, setUserGroups] = useState(null);
    // Get all groups linked to user
    useEffect(() => {
        async function groupRetrieve() {
            if (userId && csrfToken) {
                try {
                    const response = await userWithAddedGroups(userId, csrfToken);
                    setUserGroups(response.data);
                } catch (error) {
                    console.error('Error fetching user groups:', error);
                }
            }
        }
        groupRetrieve();
    }, [userId, csrfToken]);

    useEffect(() => {
        if (userGroups) {
            setGroupNames(userGroups.map(data => data));
        }
    }, [userGroups]);

    const redirectHomePage = () => {
        navigate('/accueil');
    }

    // Remove open menu because it is positioned on top of other elements 
    function removeGroupOpenMenu(e) {
        const burgerMenu = getElementByClassName('burger-menu-container')
        burgerMenu.style.display = 'none';
    }

    return <div className='burger-menu-container'>
        <div className='close-menu-container'>
            <div className='close-menu-icon close-txt' onClick={closeMenu}>
                <i className="fa-solid fa-xmark"></i>
            </div>
            <div className='close-menu-txt close-txt' onClick={closeMenu}>Fermer</div>
        </div>
        <div className='opened_menu-logo-and-btns-container'>
            <div className='logo-container opened-menu-logo-container'>
                <div className='logo'>
                    <img src={logo} alt="logo" onClick={redirectHomePage} />
                </div>
                <div className='logo-text' onClick={redirectHomePage}>EcoConscience</div>
            </div>
            <div className='open-small-menu-group-txt close-txt'>Groups membre</div>
            <div className='opened-menu-btns-container'>
                {groupNames && groupNames.map((groupName, index) => (
                    <div className='text-center group-names-container' key={index}>
                        {groupName.group_name ? <NavLink key={index} className='navlink'
                            onClick={(e) => removeGroupOpenMenu(e.target.clicked)}
                            to={`/${groupName.group_name.toLowerCase().replace(/ /g, '-')}/${groupName.group_id}`}>
                            <p>{groupName.group_name}</p>
                        </NavLink> : <div className='text-center'>Aucun group</div>}
                    </div>
                ))}
            </div>
        </div>
    </div>
}


export default SmallScreenOpenGroup;