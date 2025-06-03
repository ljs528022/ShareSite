import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';
import { getData, postData } from './api';
import { useToast } from '../util/ToastContext';
import '../css/util/chatroom.css';

const ChatRoom = ({ senderKey, receiverKey }) => {

    const [ chatRoom, setChatRoom ] = useState(null);
    const [ messages, setMessages ] = useState([]);
    const [ input, setInput ] = useState('');
    const clientRef = useRef(null);

    const { showToast } = useToast();

    useEffect(() => {
        if(!senderKey && !receiverKey) return;

        const createChatRoom = async () => {
            try {
                const response = await postData("/chat/room", {
                    senderKey,
                    receiverKey
                });
                setChatRoom(response.data);
            } catch {
                showToast("채팅방을 불러오지 못했습니다...", "error");
            }
        };
        createChatRoom();
    }, []);

    useEffect(() => {
        if(!chatRoom) return;

        const fetchMessage = async () => {
            try {
                const response = await getData(`/chat/history/${chatRoom.roomKey}`);
                setMessages(response.data);
            } catch {
                showToast("메세지를 불러오지 못했습니다...", "error");
            }
        };
        fetchMessage();
    }, [chatRoom]);

    useEffect(() => {
        if(!chatRoom) return;
        const roomKey = chatRoom.roomKey;

        const token = sessionStorage.getItem("token");
        const socket = new SockJS(`http://localhost:8093/ws-chat?token=${token}`);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            onConnect: (frame) => {
                console.log('Connected:', frame);

                client.subscribe(`/topic/chat/${roomKey}`, (message) => {
                const msg = JSON.parse(message.body);
                setMessages((prev) => [...prev, msg]);
                });
            },
            onStompError: (frame) => {
                console.error('Broker Error:', frame.headers['message']);
                console.error('Additional details:', frame.body);
            },
            onWebSocketError: (event) => {
                console.error("WebSocket 연결 실패 (onWebSocketError):", event);
            }
        });
        clientRef.current = client;
        client.activate();

        return () => {
            if(clientRef.current) {
                clientRef.current.deactivate();
            }
        }
    }, [chatRoom]);

    const sendMessage = () => {
        if(input && clientRef.current?.connected && chatRoom) {
            const chatMessage = {
                senderKey: senderKey,
                receiverKey: receiverKey,
                message: input,
            };
            clientRef.current.publish({
                destination: `/app/send/${chatRoom.roomKey}`,
                body: JSON.stringify(chatMessage),
            });
            setInput('');
        } else {
            console.warn("메시지 전송 실패: 연결 안 됨");
        }
    };

    const fetchMessages = (messages) => {
        if(!messages) return;

        return (
        <div>

        </div>
        );
    }

    if(!senderKey && !receiverKey && !clientRef) return;

    return (
        <div className='chat-room'>
            <div className='chat-box'>
                {messages.length > 0 ? 
                ""
                :
                <span className='chat-span'>나눴던 대화가 없어요. 인사부터 시작해볼까요?</span>
                }
                {messages.map((msg, idx) => (
                    <div key={idx}>
                        <strong>{msg.sender}</strong> : {msg.message} <i>({msg.timestamp})</i>
                    </div>
                ))}
            </div>
            <div className='chat-input'>
                <input
                    className='chat-message'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='메세지를 입력해주세요'
                    />
                <button className='chat-btn' onClick={sendMessage}>전송</button>
            </div>
        </div>
    );
};

export default ChatRoom;