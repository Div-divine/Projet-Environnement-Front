import groupIcon from '../../assets/svg/teamspeak.svg';
import MsgIcon from '../../assets/svg/comment-solid.svg';
import { Link } from 'react-router-dom';
import '../../style/FriendsStyle.css';
import GetAllUserFriends from '../../api/GettingUserFriendsApi';
import { useState, useEffect } from 'react';
import SideBar from '../Menus/SideBarMenu';
import UserWithAddedGroups from '../../api/UserWithGroupsApi';
import existsChatroom from '../../api/ExistChatRoomApi';
import chatRoom from '../../api/creatingChatRoomApi';

const FriendsPage = () => {

    const [freindsId, setFriendsId] = useState(null);
    const userId = localStorage.getItem('userId');
    const [friendsData, setFriendsData] = useState(null);
    // Set users id's
    const [user1Id, setUser1Id] = useState();
    const [user2Id, setUser2Id] = useState();
    const [clickedUserId, setClickedUserId] = useState(null);


     // Function to handle click on a user and get the id of the clicked user
     const ClickHandler = async (userClickedId) => {
        setClickedUserId(userClickedId);

        if (userId && userClickedId) {
            try {
                // Check if chatroom already exists
                const chatroomIdData = await existsChatroom(userId, userClickedId);
                if (chatroomIdData && chatroomIdData.chatroom_id) {
                    // If chatroom already exists, set user ids and redirect to chat page
                    setUser1Id(userId);
                    setUser2Id(userClickedId);
                    window.location.href = '/chat';
                } else {
                    // If chatroom doesn't exist, create it
                    const usersToConnect = { user1Id: userId, user2Id: userClickedId };
                    await chatRoom(usersToConnect);
                    // Set user ids and redirect to chat page
                    setUser1Id(userId);
                    setUser2Id(userClickedId);
                    window.location.href = '/chat';
                }
            } catch (error) {
                console.error('Error handling user click:', error);
            }
        }
    };
    useEffect(() => {
        if (user1Id && user2Id) {
            localStorage.setItem('user1', user1Id);
            localStorage.setItem('user2', user2Id);
        }
    }, [user1Id, user2Id])
    // Get user friends 
    useEffect(() => {
        if (userId) {
            const getfriends = async (id) => {
                const response = await GetAllUserFriends(id)
                console.log('User friends are:', response)
                setFriendsId(response);
            }
            getfriends(userId);
        }

    }, [userId]);



    useEffect(() => {
        if (freindsId) {
            const getFriendsData = async (ids) => {
                try {
                    // Map each user_id to a promise that fetches data for that user
                    const promises = ids.map(async (friend) => {
                        const response = await UserWithAddedGroups(friend.user_id);
                        return response.data;
                    });

                    // Wait for all promises to resolve
                    const friendData = await Promise.all(promises);

                    // Set the combined data for all friends
                    setFriendsData(friendData);
                } catch (error) {
                    console.error("Error fetching friends data:", error);
                    // Handle error if necessary
                }
            };
            getFriendsData(freindsId);
        }
    }, [freindsId]);

    useEffect(() => {
        if (friendsData) {
            console.log('Friend data is:', friendsData)
        }
    }, [friendsData])


    return (
        <div className="group-page-container">
            <header>
                <nav>
                    <SideBar />
                </nav>
            </header>
            <main className='group-main-elements'>
                <div className='group-inner-container friends-upper-container'>
                    {friendsData && friendsData.map((user, userIndex) => {
                        let userImageDisplayed = false;
                        return (
                            <div key={userIndex} >
                                {user.map((innerData, index) => {
                                    // Display user image only once per user
                                    const userImage = !userImageDisplayed && (
                                        <div key={`img-${userIndex}`} className='img-name-and-btn-container'>
                                            <div className='img-and-name-container'>
                                                <div className='img-container'>
                                                    <img src={`../../src/${innerData.user_img}`} alt="" className='popover-img' />
                                                </div>
                                                {/* Display user name */}
                                                <div className='user-name-container'>{innerData.user_name}</div>
                                            </div>
                                            {/* Buttons */}
                                            <div className='btns-container'>
                                                <input type="button" value='Messagerie'className='message-button' onClick={()=>ClickHandler(innerData.user_id)}/>
                                                <input type="button" value='Supprimer' className='delete-button'/>
                                            </div>
                                        </div>
                                    );
                                    userImageDisplayed = true;

                                    return (
                                        <div key={index} >
                                            {userImage}
                                            {/* Display group name */}
                                            {innerData.group_name ? <div className='popover-groups-name'>- {innerData.group_name}</div> : <div className='popover-groups-name'>- No Groups</div>}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );

}

export default FriendsPage;