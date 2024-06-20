import { useState, useEffect } from "react";
import SideBar from "../../Menus/SideBarMenu";
import '../../../style/DisplayAllUsers.css';
import AllUsers from "../../../api/GetAllUsersApi";
import JoinAllGroupsToUsers from "../../../api/ListAllJoinUserWithGroupsApi";
import SearchBar from "../../input-field/SearchBar";
import DisplayConnectedSmallMenu from "../../Menus/DisplaySmallScreenConnectedMenu";
import AdminSidebar from "../menus/AdminSidebar";

const AdminRenderAllUsers = () => {
    const userId = localStorage.getItem('userId');
    const [userGroups, setUserGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await JoinAllGroupsToUsers(userId);
                const usersWithStatus = response.data.map(user => ({
                    ...user,
                    userStatus: getUserStatus(user.groups.length)
                }));
                setUserGroups(usersWithStatus);
            } catch (error) {
                console.error("Error fetching user groups:", error);
            }
        }

        fetchData();
    }, [userId]);

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
                <AdminSidebar/>
                <div className="users-and-sidebar-container">
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
                <main className='group-main-elements'>
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
                                            <p className="table-names-text">{user.user.user_name}</p>
                                        </th>
                                        <td className="text-center">
                                            <p className="table-names-text">{user.user.user_created}</p>
                                        </td>
                                        <td className="text-center">
                                            {user.groups.map(group => (
                                                <p key={group.group_id} className="table-names-text">{group.group_name}</p>
                                            ))}
                                            {/* If user has no groups, display a message */}
                                            {user.groups.length === 0 && <p className="table-names-text">Aucun group membre</p>}
                                        </td>
                                        <td className="text-center">
                                            <p className="table-names-text">{user.user.user_email}</p>
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
        );
    } else {
        return null;
    }
};

export default AdminRenderAllUsers;
