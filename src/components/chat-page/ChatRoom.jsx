import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import useStoreValueInputedInField from '../../custom-hooks/HookFormInputController';

// const socket = io.connect("http://localhost:3000");

const ChatRoom = () => {

    // Set room state
    const [room, setRoom] = useStoreValueInputedInField();

    // Message status
    const [message, setMessage] = useStoreValueInputedInField();
    const [messageReceived, setMessageReceived] = useState('');

    const joinRoom = () => {
        if (room !== "") {
            socket.emit("join_room", room)
        }
    };

    const sendMsg = () => {
        socket.emit("send_msg", { message, room })
    };

    useEffect(() => {
        socket.on('received_msg', (data) => {
            setMessageReceived(data.message)
        });
    }, [socket]);
    return <>
        <div>
            <input type="number" placeholder="Enter room id..." value={room} onChange={setRoom} />
            <button onClick={joinRoom}>Enter room id</button>
            <input type="text" placeholder="message..." value={message} onChange={setMessage} />
            <button onClick={sendMsg}>Send a message</button>
            <h1>Message:</h1>
            {messageReceived}
        </div>
    </>
}

export default ChatRoom;