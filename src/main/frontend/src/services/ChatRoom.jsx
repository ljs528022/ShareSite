import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';
import { getData, postData } from './api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../util/ToastContext';

const ChatRoom = ({ senderKey, receiverKey }) => {

    const [ chatRoom, setChatRoom ] = useState(null);
    const [ messages, setMessages ] = useState([]);
    const [ input, setInput ] = useState('');
    const stompClient = useRef(null);

    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        if(!senderKey && !receiverKey) return;
        const createChatRoom = async (senderKey, receiverKey) => {
            try {
                const response = await postData("/chat/room", {
                    senderKey,
                    receiverKey
                });
                
                setChatRoom(response.data);
                navigate(`/chat/${chatRoom.roomKey}`);
            } catch {
                showToast("채팅방을 불러오지 못했습니다...", "error");
            }
        };
        createChatRoom();
    }, []);

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const response = await getData(`/chat/history/${chatRoom.roomKey}`);
                setMessages(response.data);
            } catch {
                showToast("메세지를 불러오지 못했습니다...", "error");
            }
        };
        fetchMessage();
    }, [chatRoom.roomKey]);

    useEffect(() => {
        if(!chatRoom) return;

        const token = sessionStorage.getItem("token");
        const socket = new SockJS('http://localhost:8093/ws-chat');
        const client = Stomp.over(socket);
        stompClient.current = client;

        client.connect({
            Authorization: `Bearer ${token}`,
        }, () => {
            client.subscribe(`/topic/chat/${chatRoom.roomKey}`, (message) => {
                const msg = JSON.parse(message.body);
                setMessages((prev) => [...prev, msg]);
            });
        },
        (error) => {
            console.error("WebSocket 연결 실패...", error);
        });

        return () => {
            if(stompClient.current) {
                stompClient.current.disconnect();
            }
        }
    }, []);

    const sendMessage = () => {
        if(input && stompClient.current?.connected && chatRoom) {
            const chatMessage = {
                roomKey: chatRoom.roomKey,
                message: input,
            };
            stompClient.current.send(`/chat/send/${chatRoom.roomKey}`, {}, JSON.stringify(chatMessage));
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