import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';

const ChatRoom = ({ username, roomKey }) => {
    const [ messages, setMessages ] = useState([]);
    const [ input, setInput ] = useState('');
    const stompClient = useRef(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8093/ws-chat');
        const client = Stomp.over(socket);
        stompClient.current = client;

        client.connect({}, () => {
            client.subscribe(`/topic/chat/${roomKey}`, (message) => {
                const msg = JSON.parse(message.body);
                setMessages((prev) => [...prev, msg]);
            });
        });

        return () => {
            if(stompClient.current) {
                stompClient.current.disconnect();
            }
        }
    }, [roomKey]);

    const sendMessage = () => {
        if(input && stompClient.current?.connected) {
            const chatMessage = {
                roomKey,
                sneder: username,
                messages: input,
            };
            stompClient.current.send('/app/chat/send', {}, JSON.stringify(chatMessage));
            setInput('');
        }
    };

    return (
        <div>
            <div className='chat-box'>
                {messages.map((msg, idx) => (
                    <div key={idx}>
                        <strong>{msg.sender}</strong> : {msg.message} <i>({msg.timestamp})</i>
                    </div>
                ))}
            </div>
            <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='메세지를 입력해주세요...'
            />
            <button onClick={sendMessage}>전송</button>
        </div>
    );
};

export default ChatRoom;