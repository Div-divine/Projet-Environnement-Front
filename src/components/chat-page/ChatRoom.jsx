import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import chatRoomId from '../../api/GetChatRoomIdApi';
import '../../style/ChatroomStyle.css';
import insertUsersMsg from '../../api/InsertUserMsgApi';

const socket = io.connect("http://localhost:3000");

const ChatRoom = () => {
    const user1Id = localStorage.getItem('user1');
    const user2Id = localStorage.getItem('user2');
    const [chatroomId, setChatroomId] = useState(null);
    // Set chatroom 
    const [room, setRoom] = useState("");
    // Message status
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState('');

    useEffect(() => {
        if (!user1Id || !user2Id) {
            console.error('User IDs are not set in localStorage');
            return;
        }
        async function getChatroomId(user1, user2) {
            const response = await chatRoomId(user1, user2);
            console.log('chatroom id:', response);
            setChatroomId(response.chatroom_id);
        }
        // call function here 
        getChatroomId(user1Id, user2Id);
    }, [user1Id, user2Id]);

    // Set room id 
    useEffect(() => {
        if (chatroomId) {
            setRoom(chatroomId);
        }
    }, [chatroomId]);

    // Create the room here
    useEffect(() => {
        if (room !== "") {
            socket.emit("join_room", room)
        }
    }, [room])
    
    // Handle input field change as it is a controlled field 
    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    const sendMsg = async (e) => {
        e.preventDefault();
        // Emit the message through socket
        socket.emit("send_msg", { message, room, sender: user1Id, receiver: user2Id });
        
        try {
            // Insert the message into the database
            await insertUsersMsg({ message, user1Id, user2Id, chatroomId: room });
        } catch (error) {
            console.error('Error inserting message:', error);
        }

        // Concatenate the new message with the existing messages
        setMessages(messages + `\n${user1Id}: ${message}`);
        setMessage('');
    };


    useEffect(() => {
        socket.on('received_msg', (data) => {
            // Concatenate the new received message with the existing messages
            setMessages(messages + `\n${user2Id}: ${data.message}`);
        });
    }, [socket, user2Id]);

    return (
        <div>
            <div className="message-container">
                <pre>{messages}</pre> {/* Display messages as a string */}
            </div>
            <form onSubmit={sendMsg}>
                <input type="text" placeholder="message..." value={message} onChange={handleChange} />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default ChatRoom;
