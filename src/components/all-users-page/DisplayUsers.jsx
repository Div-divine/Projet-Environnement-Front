import { useState, useEffect } from "react";
import SideBar from "../Menus/SideBarMenu";
import '../../style/DisplayAllUsers.css'
import userIcon from '../../assets/user-profile.svg';
import JoinAllGroupsToUsers from "../../api/ListAllJoinUserWithGroupsApi";
import SearchBar from "../input-field/SearchBar";
import { motion } from "framer-motion";
import Popover from "./Popover";
import PopoverContents from "./PopoverContents";
import { useNavigate } from "react-router-dom";
import chatRoom from "../../api/creatingChatRoomApi";
import existsChatroom from "../../api/ExistChatRoomApi";
import createFriends from "../../api/CreateFriendsApi";
import DisplayConnectedSmallMenuy from "../Menus/DisplaySmallScreenConnectedMenu";
import { useCsrf } from "../../context/CsrfContext";



const RenderAllUsers = () => {
    const csrfToken = useCsrf()
    const navigate = useNavigate();
    // Image url from the back
    const imgUrl = 'http://localhost:3000/assets';
    const userId = localStorage.getItem('userId');
    const [userGroups, setUserGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    // Function to handle click on a user and get the id of the clicked user
    const handleUserClick = async (userClickedId) => {

        if (userId && userClickedId && csrfToken) {
            try {
                // Check if chatroom already exists
                const chatroomIdData = await existsChatroom(userId, userClickedId, csrfToken);
                if (chatroomIdData && chatroomIdData.chatroom_id) {
                    // If chatroom already exists, set user ids and redirect to chat page
                    localStorage.setItem('user1', userId);
                    localStorage.setItem('user2', userClickedId);
                    navigate('/chat');
                } else {
                    // If chatroom doesn't exist, create it
                    const usersToConnect = { user1Id: userId, user2Id: userClickedId };
                    await chatRoom(usersToConnect, csrfToken);
                    localStorage.setItem('user1', userId);
                    localStorage.setItem('user2', userClickedId);
                    // Set user ids and redirect to chat page
                    navigate('/chat');
                }
            } catch (error) {
                console.error('Error handling user click:', error);
            }
        }
    };

    const addFriend = async (userClickedId, csrf) => {
        if (userId && userClickedId && csrf) {
            const friends = {
                user1Id: userId,
                user2Id: userClickedId
            }
            await createFriends(friends, csrf);
            window.location.reload();
        }
    }

    useEffect(() => {
        if (userId && csrfToken) {
            async function fetchData() {
                try {
                    const response = await JoinAllGroupsToUsers(userId, csrfToken);
                    setUserGroups(response.data);
                    console.log('Check users from list:', response.data)
                } catch (error) {
                    console.error("Error fetching user groups:", error);
                }
            }

            fetchData();
        }
    }, [userId, csrfToken]);

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
            <SideBar />
            <DisplayConnectedSmallMenuy />
            <div>
                <div className="users-and-sidebar-container stick-top-user-search-container">
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
                <main className="main-elements">
                    <div className="small-screen-users-count">Total utilisateurs:  {filteredUserGroups.length + 1}</div>
                    <div className="user-listing-overall-container">
                        {csrfToken && filteredUserGroups.map((user, index) => (
                            <div key={index} className="user-listing-container mb-3">
                                <div className="user-image-container" key={index}>
                                    {user.user.user_img && user.user.show_user_image ? <img src={`${imgUrl}/${user.user.user_img}`} alt="User" /> : <img src={userIcon} alt="No image" />}
                                </div>
                                <div className="user-lower-container">
                                    <div className="user-name-and-popover-container">
                                        <Popover content={<PopoverContents
                                            pathHandler={(user.user.user_img && user.user.show_user_image ? `${imgUrl}/${user.user.user_img}` : userIcon)}
                                            userNameHandler={user.user.user_name}
                                            groupHandler={user.groups}
                                            dataHandler={user.user.user_created}
                                            ClickHandler={() => handleUserClick(user.user.user_id)}
                                            addFriendHandler={() => addFriend(user.user.user_id, csrfToken)}
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
                                    </div>
                                    <div className="user-name-for-small-screen">
                                        <p className="user-name">{user.user.user_name}</p>
                                    </div>
                                    <div className="mt-1">
                                        <p className="user-group">{user.groups.length} Group membre</p>
                                    </div>
                                    <div className="add-user-button-container mt-1" onClick={() => addFriend(user.user.user_id, csrfToken)}>
                                        <input type="button" value="Ajouter à tes liste d'amis" className="add-btn-field text-center big-input-add" />
                                        <input type="button" value="Ajouter" className="add-btn-field text-center small-input-add" />
                                    </div>
                                    <div className="small-screen-msg-input-container">
                                        <input type="button" value="💬 Message" className="add-btn-field text-center small-screen-msg-input chat-btn" onClick={() => handleUserClick(user.user.user_id)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>)
    }
}

export default RenderAllUsers;