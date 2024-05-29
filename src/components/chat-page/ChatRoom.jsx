import io from 'socket.io-client';
import { useEffect, useState, useRef } from 'react';
import chatRoomId from '../../api/GetChatRoomIdApi';
import '../../style/ChatroomStyle.css';
import insertUsersMsg from '../../api/InsertUserMsgApi';
import SideBar from '../Menus/SideBarMenu';
import likeIcon from '../../assets/svg/thumbs-up.svg';
import fileUploadIcon from '../../assets/svg/file-solid.svg';
import { motion } from 'framer-motion';
import usersMsgInChatroom from '../../api/GetUsersMsgInChatroomApi';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import getUserDataById from '../../api/GetUserDataByIdApi';
import updateMessageStatusToRead from '../../api/UpdateMsgReadStatusApi';
import DisplayConnectedSmallMenu from '../Menus/DisplaySmallScreenConnectedMenu';

const socket = io.connect("http://localhost:3000/");

const ChatRoom = () => {
    const connectedUserId = localStorage.getItem('userId');
    const user1Id = localStorage.getItem('user1');
    const user2Id = localStorage.getItem('user2');
    const [chatroomId, setChatroomId] = useState(null);
    // Set chatroom 
    const [room, setRoom] = useState(null);
    // Message status
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(null);
    const [chatroomMsg, setChatroomMsg] = useState(null);

    const [receiverImg, setReceiverImg] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [viewedMessages, setViewedMessages] = useState([]);

    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        // Do something with the selected files
    };
    // Get the receiver image using it id to query users table
    useEffect(() => {
        if (user2Id) {
            const fetchReceiverData = async () => {
                try {
                    const data = await getUserDataById(user2Id);
                    if (data && data.user) {
                        setReceiverImg(data.user.user_img);
                        setReceiverName(data.user.user_name);
                    }
                } catch (error) {
                    console.error('Error fetching receiver data:', error);
                }
            };

            fetchReceiverData();
        }
    }, [user2Id]);


    // Use date-fn to format date and time in french local time
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, "EEEE, d MMMM yyyy HH'h'mm", { locale: fr });
    };


    useEffect(() => {
        if (!user1Id || !user2Id) {
            console.error('User IDs are not set in localStorage');
            return;
        }

        // once the two users id exists , display all messages in each chat room
        async function userMsg(user1, user2) {
            const response = await usersMsgInChatroom(user1, user2);
            setMessages(response);
        }
        async function getChatroomId(user1, user2) {
            const response = await chatRoomId(user1, user2);
            console.log('chatroom id from response:', response);
            setChatroomId(response[0].chatroom_id);
        }
        // call functions here 
        getChatroomId(user1Id, user2Id);
        userMsg(user1Id, user2Id);
    }, [user1Id, user2Id]);

    // Set room id 
    useEffect(() => {
        if (chatroomId) {
            setRoom(chatroomId);
        }
    }, [chatroomId]);

    // Create the room here
    useEffect(() => {
        if (room != null) {
            socket.emit("join_room", { room: room, senderId: user1Id })
        }
    }, [room])

    // Handle input field change as it is a controlled field 
    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    const sendMsg = async (e) => {
        e.preventDefault();
        // Emit the message through socket
        socket.emit("send_msg", { message, room: chatroomId, sender: user1Id, receiver: user2Id });

        console.log('chatroom is :', chatroomId)

        try {
            // Insert the message into the database
            await insertUsersMsg({ message, user1Id, user2Id, chatroomId });
            const response = await usersMsgInChatroom(user1Id, user2Id);
            console.log('User chat room messages info to sender....: ', response)
            // Concatenate the new message with the existing messages
            setMessages(response);
        } catch (error) {
            console.error('Error inserting message:', error);
        }
        setMessage('');
    };



    useEffect(() => {
        socket.on('received_msg', async () => {
            await updateMessageStatus();
            async function senderMsgResponse() {
                const response = await usersMsgInChatroom(user1Id, user2Id);
                console.log('User chat room messages info to receiver: ', response);
                // Concatenate the new received message with the existing messages
                setMessages(response);
            }
            senderMsgResponse();

        });

        // Function to update the message status
        const updateMessageStatus = async () => {
            try {
                if (messages) {
                    // Call your API to update the message status
                    await updateMessageStatusToRead(messages.map(msg => msg.msg_id), chatroomId);
                    console.log('Message status updated successfully');
                }

            } catch (error) {
                console.error('Error updating message status:', error);
            }
        };
    }, [socket, user2Id, connectedUserId, chatroomMsg, messages]);


    useEffect(() => {
        if (messages != 'No message found' && messages) {
            console.log('All messages data : ', messages);
            setChatroomMsg(messages.map((data, index) => {
                return data
            }))
        }
    }, [messages])

    useEffect(() => {
        scrollToBottom();
    }, [chatroomMsg]);


    // This makes sure to keep the last message in view
    const scrollToBottom = () => {
        const lastMessage = document.querySelector('.last-message');
        if (lastMessage) {
            lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    return (
        <div>
            <SideBar />
            <main className='chatroom-main-container'>
                <DisplayConnectedSmallMenu />
                <div className='chatroom-inner-container'>
                    <div className="message-container">
                        <div className='receiver-img-and-name-in-chat'>
                            <div className='receiver-img-container-in-chat'>
                                <img src={`../../src/${receiverImg}`} alt="receiver image" />
                            </div>
                            <div className='receiver-name-container-in-chat text-center'>
                                <p>{receiverName}</p>
                            </div>
                        </div>
                        {chatroomMsg && chatroomMsg.map((msg, index) => {
                            const owner = msg.sender_id == connectedUserId ? 'sender' : 'receiver';
                            const formattedDate = formatDate(msg.msg_created);
                            console.log('message id of msg :', msg.msg_content, ' is : ', msg.msg_id)

                            return (
                                <div key={index} className={owner == 'sender' ? 'flex-right' : 'flex-left'}>
                                    <div className={`${index === chatroomMsg.length - 1 ? 'last-message' : ''} messages-contents-container`}>

                                        <div className={`card card-body ${owner} msg-contents-inner-container`}>
                                            <p className='msg-text'>{msg.msg_content}</p>
                                            <br />
                                            <p className='msg-date'>{formattedDate}</p>
                                        </div>

                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className='msg-iput-and-icons-container'>
                        <div className='form-upper-container'>
                            <form onSubmit={sendMsg} className='form-container'>
                                <textarea type="text-area" placeholder="Message..." value={message} onChange={handleChange} className='form-control msg-input-field' rows="3" />
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className='submit-btn-container'>
                                    <input type="submit" value="Envoyer" className='msg-submit-btn' />
                                </motion.div>
                            </form>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <div className='like-and-file-icon-container'>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className='file-uploader-container' onClick={handleClick}>
                                <img src={fileUploadIcon} alt="file uploader icon" />
                            </motion.div>
                            <motion.div className='like-icon-container'
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}>
                                <img src={likeIcon} alt="thumb up icon" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main >
        </div >
    );
}

export default ChatRoom;
