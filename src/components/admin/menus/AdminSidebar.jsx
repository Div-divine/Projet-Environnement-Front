import '../../../style/admin-sidebar.css'
import Logo from '../../../../logo/white-logo.svg';
import logOutIcon from '../../../assets/logout.svg';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
    return <div className="admin-sidebar-container">
        <header>
            <nav>
                <div>
                    <div className='admin-sidebar-logo-container'><img src={Logo} alt="Website logo" /></div>
                    <div className='admin-sidebar-logo-text'>EcoConscience</div>
                </div>
                <div className='flex-logout-end-container'>
                    <div className='admin-sibedar-navs-container'>
                        <NavLink className='admin-sidebar-dashboard-logo-text-container'>
                            <div className='dashboard-svg'><i className="fa-solid fa-table-columns" /></div>
                            <div>Tableau de bord</div>
                        </NavLink>
                        <NavLink className='admin-sidebar-dashboard-logo-text-container lower-navs'>
                            <div className='dashboard-svg'><i className="fa-solid fa-users" /></div>
                            <div>Utilisateurs</div>
                        </NavLink>
                        <NavLink className='admin-sidebar-dashboard-logo-text-container lower-navs'>
                            <div className='dashboard-svg'><i className="fa-solid fa-layer-group" /></div>
                            <div>Groups</div>
                        </NavLink>
                        <NavLink className='admin-sidebar-dashboard-logo-text-container lower-navs'>
                            <div className='dashboard-svg'><i class="fa-solid fa-gear" /></div>
                            <div>Paramètre</div>
                        </NavLink>
                    </div>
                    <div>
                        <NavLink className='admin-sidebar-dashboard-logo-text-container lower-navs'>
                            <div className='dashboard-svg'><img src={logOutIcon} alt="" /></div>
                            <div>Se déconnecter</div>
                        </NavLink>
                    </div>
                </div>
            </nav>
        </header>
    </div>
}

export default AdminSidebar;