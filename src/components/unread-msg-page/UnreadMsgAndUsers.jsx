import { useEffect, useState } from "react";
import GetUnreadMsg from "../../api/GetUnreadMsgAndUsersApi";
import SideBar from "../Menus/SideBarMenu";
import { formatDistanceToNow } from "date-fns";
import frLocale from 'date-fns/locale/fr'; // Import the French locale statically
import '../../style/unreadMsgAndUsers.css'
import existsChatroom from "../../api/ExistChatRoomApi";
import chatRoom from "../../api/creatingChatRoomApi";
import { useNavigate } from "react-router-dom";
import DisplayConnectedSmallMenu from "../Menus/DisplaySmallScreenConnectedMenu";
import userIcon from '../../assets/user-profile.svg';
import { useCsrf } from "../../context/CsrfContext";

const DisplayUnreadMsgUsers = () => {
    const csrfToken = useCsrf()
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId');
    const [unreadMsgAndUser, setUnreadMsgAndUsers] = useState(null);
    const [formattedDates, setFormattedDates] = useState([]); // Use an array for multiple dates
    const [clickedUserId, setClickedUserId] = useState(null)
    // Set users id's
    const [user1Id, setUser1Id] = useState();
    const [user2Id, setUser2Id] = useState();

    // Image url from the back
    const imgUrl = 'http://localhost:3000/assets';

    useEffect(() => {
        if (userId && csrfToken) {
            async function getData(id, csrf) {
                const data = await GetUnreadMsg(id, csrf)
                console.log('Unread Msg Datas:', data)
                if (data !== 'No unread message found') {
                    setUnreadMsgAndUsers(data);
                }
            }
            getData(userId, csrfToken);
        }
    }, [userId, csrfToken]);

    useEffect(() => {
        if (unreadMsgAndUser) {
            const formattedDates = unreadMsgAndUser.map((data) => {
                // Convert the msg_updated string to a Date object
                const date = new Date(data.msg_updated);
                // Format the time difference for each unread message
                return formatDistanceToNow(date, { locale: frLocale, addSuffix: true, includeSeconds: true });
            });
            setFormattedDates(formattedDates);
        }
    }, [unreadMsgAndUser]);

    const groupMessagesBySender = (messages) => {
        const groupedMessages = {};
        if (messages) {
            messages.forEach(message => {
                const senderId = message.sender_user_id;

                if (groupedMessages[senderId]) {
                    groupedMessages[senderId].msg_count += 1;
                    groupedMessages[senderId] = {
                        ...message,
                        msg_count: groupedMessages[senderId].msg_count,
                    };
                } else {
                    groupedMessages[senderId] = {
                        ...message,
                        msg_count: 1,
                    };
                }
            });

            return Object.values(groupedMessages);
        }
        return [];
    };

    // Get grouped messages
    const groupedMessages = groupMessagesBySender(unreadMsgAndUser);

    console.log('grouped messages:', groupedMessages);

    async function openChatRoom(userClickedId, csrf) {
        if (userId && userClickedId && csrf) {
            try {
                console.log('User connected in unread msg :', userId , 'User clicked to see unread msg:', userClickedId)
                setClickedUserId(userClickedId);
                // Check if chatroom already exists
                const chatroomIdData = await existsChatroom(userId, userClickedId, csrf);
                if (chatroomIdData && chatroomIdData.chatroom_id) {
                    // If chatroom already exists, set user ids and redirect to chat page
                    setUser1Id(userId);
                    setUser2Id(userClickedId);
                    //navigate('/chat');
                } else {
                    // If chatroom doesn't exist, create it
                    const usersToConnect = { user1Id: userId, user2Id: userClickedId };
                    await chatRoom(usersToConnect, csrf);
                    // Set user ids and redirect to chat page
                    setUser1Id(userId);
                    setUser2Id(userClickedId);
                    //navigate('/chat');
                }
            } catch (error) {
                console.error('Error handling user click:', error);
            }
        }
    }

    // Set message sender id and receiver id in localStorage 
    useEffect(() => {
        if (user1Id && user2Id) {
            localStorage.setItem('user1', user1Id);
            localStorage.setItem('user2', user2Id);
            navigate('/chat');
        }
    }, [user1Id, user2Id]);

    return (
        <>
            <SideBar />
            <main className="unread-msg-main-container">
                <DisplayConnectedSmallMenu />
                {groupedMessages.length > 0 ? groupedMessages.map((data, index) => (
                    formattedDates[index] && (
                        <div key={index} className="unread-msg-and-users-container">
                            <div className="usr-img-unread-msg-and-date-container">
                                <div className="usr-img-container">
                                    <img src={(data.sender_user_img && data.sender_show_user_image ? `${imgUrl}/${data.sender_user_img}` : userIcon)} alt="User image" />
                                </div>
                                <div className="unread-usr-name-and-msg-container">
                                    <div className="name-font usr-name-container">
                                        {data.sender_user_name}
                                    </div>
                                    <div className="name-font msg-count">
                                        Messages non lus: {data.msg_count}
                                    </div>
                                    <div className="msg-and-chat-btn-container">
                                        <div className="msg-container unread-msg">
                                            {data.msg_content}
                                        </div>
                                        <div className="msg-date-sent name-font">
                                            {formattedDates[index]}
                                        </div>
                                        {csrfToken && <div className="chat-btn-container">
                                            <input type="button" value="Chat" onClick={() => openChatRoom(data.sender_user_id, csrfToken)} />
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                )) : <div className="unread-msg-and-users-container name-font no-message">Aucun méssage</div>}
            </main>
        </>
    );
}

export default DisplayUnreadMsgUsers;

