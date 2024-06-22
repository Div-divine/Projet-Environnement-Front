import { useState, useEffect } from "react";
import '../../../style/DisplayAllUsers.css';
import '../../../style/admin-users-page.css'
import JoinAllGroupsToUsers from "../../../api/ListAllJoinUserWithGroupsApi";
import SearchBar from "../../input-field/SearchBar";
import AdminSidebar from "../menus/AdminSidebar";
import { useCsrf } from "../../../context/CsrfContext";
import userIcon from '../../../assets/user-profile.svg';

const AdminRenderAllUsers = () => {
    const csrfToken = useCsrf()
    const userId = localStorage.getItem('userId');
    const [userGroups, setUserGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    // Image url from the back
    const imgUrl = 'http://localhost:3000/assets';

    useEffect(() => {
        if (userId && csrfToken) {
            async function fetchData() {
                try {
                    const response = await JoinAllGroupsToUsers(userId, csrfToken);
                    const usersWithStatus = response.data.map(user => ({
                        ...user,
                        userStatus: getUserStatus(user.groups.length)
                    }));
                    console.log('User datas from admin users:', usersWithStatus)
                    setUserGroups(usersWithStatus);
                } catch (error) {
                    console.error("Error fetching user groups:", error);
                }
            }

            fetchData();
        }
    }, [userId, csrfToken]);

    const getUserStatus = (groupCount) => {
        if (groupCount > 2) {
            return <p className="table-names-text best-users-text">Trés Engagé</p>;
        }
        if (groupCount === 2) {
            return <p className="table-names-text average-users-text">Engagé</p>;
        }
        return <p className="table-names-text unactive-users-text">Moin Engagé</p>;
    };

    // Function to handle changes in the search input field
    const handleSearchChange = event => {
        setSearchQuery(event.target.value);
    };

    // Function to filter result by user name or group name
    const filteredUserGroups = userGroups.filter(user => {
        const userNameMatch = user.user.user_name.toLowerCase().includes(searchQuery.toLowerCase());
        const groupNamesMatch = user.groups.some(group => group.group_name.toLowerCase().includes(searchQuery.toLowerCase()));
        return userNameMatch || groupNamesMatch;
    });

    if (userId) {
        return (
            <div className="admin-dashboard-main-container">
                <AdminSidebar />
                <div>
                    <div className="users-and-sidebar-container stick-top-user-search-container">
                        <div>
                            <p className="table-header-text">Les utilisateurs</p>
                        </div>
                        <SearchBar
                            placeholderHandler='rechercher par utilisateur ou group...'
                            valueHandler={searchQuery}
                            setValueHandler={handleSearchChange}
                            classNameHandler="search-field"
                        />
                    </div>
                    <main className='admin-users-main-elements'>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col" className="text-center border-0">
                                            <p className="table-header-text">Utilisateur</p>
                                        </th>
                                        <th scope="col" className="text-center border-0">
                                            <p className="table-header-text">Crée</p>
                                        </th>
                                        <th scope="col" className="text-center border-0">
                                            <p className="table-header-text">Groups Membre</p>
                                        </th>
                                        <th scope="col" className="text-center border-0">
                                            <p className="table-header-text">Email</p>
                                        </th>
                                        <th scope="col" className="text-center border-0">
                                            <p className="table-header-text">Activité</p>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="table-container">
                                    {filteredUserGroups.map(user => (
                                        <tr key={user.user.user_id}>
                                            <th className="text-center">
                                                <div className="user-name-and-img-in-user-admin-table-container">
                                                    <div className="users-img-in-admin-users-page"><img src={user.user.user_img ? `${imgUrl}/${user.user.user_img}` : userIcon} alt="users image" /></div>
                                                    <p className="table-names-text">{user.user.user_name}</p>
                                                </div>
                                            </th>
                                            <td className="text-center">
                                                <div className="table-names-text center-text-in-admin-user-table">{user.user.user_created}</div>
                                            </td>
                                            <td className="text-center">
                                                {user.groups.map(group => (
                                                    <div key={group.group_id} className="table-names-text">{group.group_name}</div>
                                                ))}
                                                {/* If user has no groups, display a message */}
                                                {user.groups.length === 0 && <div className="table-names-text">Aucun group membre</div>}
                                            </td>
                                            <td className="text-center">
                                                <div className="table-names-text">{user.user.user_email}</div>
                                            </td>
                                            <td className="text-center">
                                                {user.userStatus}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div>
            </div>
        );
    } else {
        return null;
    }
};

export default AdminRenderAllUsers;
