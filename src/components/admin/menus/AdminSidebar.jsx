import '../../../style/admin-sidebar.css'
import Logo from '../../../../logo/white-logo.svg';
import logOutIcon from '../../../assets/logout.svg';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
    return <div className="admin-sidebar-container">
        <header>
            <nav>
                <NavLink to='/admin/accueil' className='admin-page-navlink-logo'>
                    <div className='admin-sidebar-logo-container'><img src={Logo} alt="Website logo" /></div>
                    <div className='admin-sidebar-logo-text'>EcoConscience</div>
                </NavLink>
                <div className='flex-logout-end-container'>
                    <div className='admin-sibedar-navs-container'>
                        <NavLink className={({ isActive }) =>
                            isActive
                                ? 'admin-sidebar-dashboard-logo-text-container active-nav-link'
                                : 'admin-sidebar-dashboard-logo-text-container'
                        }
                            to='/admin/accueil'>
                            <div className='dashboard-svg'><i className="fa-solid fa-table-columns" ></i></div>
                            <div>Tableau de bord</div>
                        </NavLink>
                        <NavLink className={({ isActive }) =>
                            isActive
                                ? 'admin-sidebar-dashboard-logo-text-container active-nav-link'
                                : 'admin-sidebar-dashboard-logo-text-container'
                        }
                            to='/admin/utilisateurs'>
                            <div className='dashboard-svg'><i className="fa-solid fa-users" /></div>
                            <div>Utilisateurs</div>
                        </NavLink>
                        <NavLink className={({ isActive }) =>
                            isActive
                                ? 'admin-sidebar-dashboard-logo-text-container active-nav-link'
                                : 'admin-sidebar-dashboard-logo-text-container'
                        }
                            to='/admin/groupes'>
                            <div className='dashboard-svg'><i className="fa-solid fa-layer-group" /></div>
                            <div>Groups</div>
                        </NavLink>
                        <NavLink className={({ isActive }) =>
                            isActive
                                ? 'admin-sidebar-dashboard-logo-text-container active-nav-link'
                                : 'admin-sidebar-dashboard-logo-text-container'
                        }
                            to='/admin/parametre'>
                            <div className='dashboard-svg'><i className="fa-solid fa-gear" /></div>
                            <div>Paramètre</div>
                        </NavLink>
                    </div>
                    <div>
                        <div className='admin-sidebar-dashboard-logo-text-container lower-navs'>
                            <div className='dashboard-svg'><img src={logOutIcon} alt="" /></div>
                            <div>Se déconnecter</div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    </div>
}

export default AdminSidebar;