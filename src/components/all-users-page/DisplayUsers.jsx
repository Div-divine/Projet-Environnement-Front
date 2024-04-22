import { useState, useEffect } from "react";
import SideBar from "../Menus/SideBarMenu";
import '../../style/DisplayAllUsers.css'
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
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Popover from "./Popover";
import PopoverContents from "./PopoverContents";
import { useLocation } from "react-router-dom";
import chatRoom from "../../api/creatingChatRoomApi";



const RenderAllUsers = () => {
    const location = useLocation();
    const userId = localStorage.getItem('userId');
    const [clickedUserId, setClickedUserId] = useState(null);
    const [userGroups, setUserGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    // Set users id's
    const [user1Id, setUser1Id] = useState();
    const [user2Id, setUser2Id] = useState();
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

    // Function to handle click on a user and get the id of the clicked user
    const handleUserClick = (userclickedId) => {
        setClickedUserId(userclickedId);
    };
    useEffect(() => {
        if (clickedUserId && userId) {
            const usersToConnect = {
                user1Id: userId,
                user2Id: clickedUserId
            }
            async function linkUserToChatRoom() {
                const createChatRoom = await chatRoom(usersToConnect);
            }
            linkUserToChatRoom();
            setUser1Id(userId);
            setUser2Id(clickedUserId);
            // Redirection vers la page de chat
            window.location.href = '/chat';

        }
    }, [clickedUserId, userId]);

    useEffect(() => {
        if (user1Id && user2Id) {
            localStorage.setItem('user1', user1Id);
            localStorage.setItem('user2', user2Id);
        }
    }, [user1Id, user2Id])

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
                    <SideBar />
                </nav>
            </header>
            <div className="users-and-sidebar-container">
                <div className="upper-users-text-container">
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
                <div className="user-listing-overall-container">
                    {filteredUserGroups.map((user, index) => (
                        <div key={index} className="user-listing-container mb-3">
                            <div className="user-image-container" key={index}>
                                <img src={`../../src/${user.user.user_img}`} alt="User" />
                            </div>
                            <div className="user-lower-container">
                                <Popover content={<PopoverContents
                                    pathHandler={`../../src/${user.user.user_img}`}
                                    userNameHandler={user.user.user_name}
                                    groupHandler={user.groups}
                                    dataHandler={user.user.user_created}
                                    ClickHandler={() => handleUserClick(user.user.user_id)}
                                />}>
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="mt-2"
                                    >    <div>
                                            <p className="user-name">{user.user.user_name}</p>
                                        </div>
                                    </motion.div>
                                </Popover>
                                <div className="mt-1">
                                    <p className="user-group">{user.groups.length} Group membre</p>
                                </div>
                                <div className="add-user-button-container mt-1" >
                                    <input type="button" value="Ajouter à tes liste d'amis" className="add-btn-field text-center" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="table-responsive">
                </div>
            </main>
        </div>)
    }
}

export default RenderAllUsers;