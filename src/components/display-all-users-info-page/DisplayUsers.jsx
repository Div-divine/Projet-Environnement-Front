import { useState, useEffect } from "react";
import SideBar from "../Menus/SideBarMenu";
import '../../style/DisplayAllUsers.css'
import AllUsers from "../../api/GetAllUsersApi";
import climatChangeIcon from '../../assets/svg/climate-change.svg';
import biodiversityIcon from '../../assets/svg/icon-biodiversity.svg';
import wasteManagementIcon from '../../assets/svg/icon-wastemanagement.svg';
import teamSpeakIcon from '../../assets/svg/teamspeak.svg';
import threeIcon from '../../assets/svg/three.svg';
import waterIcon from '../../assets/svg/water-icon.svg';
import windIcon from '../../assets/svg/wind-solid.svg';
import JoinAllGroupsToUsers from "../../api/ListAllJoinUserWithGroupsApi";
import userIcon from '../../assets/svg/user-solid.svg';
import likeIcon from '../../assets/svg/heart-solid.svg';
import chatIcon from '../../assets/svg/comment-solid.svg';
import SearchBar from "../input-field/SearchBar";



const RenderAllUsers = () => {
    const userId = localStorage.getItem('userId');
    const [userGroups, setUserGroups] = useState([]);
    const [userStatus, setUserStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    // Save icon paths in icons to be used in map
    const icons = [
        climatChangeIcon,
        biodiversityIcon,
        wasteManagementIcon,
        teamSpeakIcon,
        threeIcon,
        waterIcon,
        windIcon
    ]

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await JoinAllGroupsToUsers(userId);
                setUserGroups(response.data);
            } catch (error) {
                console.error("Error fetching user groups:", error);
            }
        }

        fetchData();
    }, [userId]);

    useEffect(() => {
        if (userGroups && userGroups.length > 0) {
            // Iterate over each user to set the status individually
            const getStatus = userGroups.map(user => {
                console.log('I dey here', user);
                if (user.groups.length > 2) {
                    return <p className="table-names-text best-users-text" >Trés Engagé</p>;
                }
                if (user.groups.length == 2) {
                    return <p className="table-names-text average-users-text">Engagé</p>;
                }
                if (user.groups.length < 2) {
                    return <p className="table-names-text unactive-users-text">Moin Engagé</p>
                }
                
            });

            // Set the status for each user individually
            setUserGroups(prevUserGroups => {
                return prevUserGroups.map((user, index) => {
                    return {
                        ...user,
                        userStatus: getStatus[index]
                    };
                });
            });
        }
    }, [userGroups]);


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
        return (<div className="home-page-container">
            <header>
                <nav>
                    <SideBar showUser={false} />
                </nav>
            </header>
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
            <main className="main-elements main-users">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col" className="text-center border-0"><p className="table-header-text">Utilisateur</p></th>
                                <th scope="col" className="text-center border-0"><p className="table-header-text">Crée</p></th>
                                <th scope="col" className="text-center border-0"><p className="table-header-text">Groups Membre</p></th>
                                <th scope="col" className="text-center border-0"><p className="table-header-text">Status</p></th>
                            </tr>
                        </thead>
                        <tbody className="table-container">
                            {filteredUserGroups.map(user => (
                                <tr key={user.user.user_id}>
                                    <th className="text-center"><p className="table-names-text">{user.user.user_name}</p></th>
                                    <td className="text-center"><p className="table-names-text">{user.user.user_created}</p></td>
                                    <td className="text-center">
                                        {user.groups.map(group => (
                                            <p key={group.group_id} className="table-names-text">{group.group_name}</p>
                                        ))}
                                        {/* If user has no groups, display a message */}
                                        {user.groups.length === 0 && <p className="table-names-text">Aucun group membre</p>}
                                    </td>
                                    <td className="text-center">
                                        {user.userStatus && user.userStatus}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>)
    }
}

export default RenderAllUsers;