import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';
import { deleteData, getData, postData } from './api';
import { useToast } from '../util/ToastContext';
import '../css/util/chatroom.css';
import { useUser } from './UserContext';
import { FaAngleDown, FaAngleUp, FaArrowCircleRight, FaBullhorn, FaInfoCircle } from "react-icons/fa";
import Modal from '../util/Modal';
import { useNavigate } from 'react-router-dom';

const ChatRoom = (props) => {
    const { sender, receiver } = props;

    // 로그인 중인 회원 정보
    const { user } = useUser();
    
    // 채팅방
    const [ chatRoom, setChatRoom ] = useState(null);
    const [ messages, setMessages ] = useState([]);
    const [ input, setInput ] = useState(``);
    const clientRef = useRef(null);

    // 채팅방 유저 정보 sender, receiver
    const [ senderInfo, setSenderInfo ] = useState(sender);
    const [ receiverInfo, setReceiverInfo ] = useState(receiver);
    const [ chatUserInfo, setChatUSerInfo ] = useState(null);

    // 채팅 메뉴
    const [ chatMenu, setChatMenu ] = useState(false);
    const [ closeChat, setCloseChat ] = useState(false);

    // 대화 상대의 정보
    const [ showUserInfo, setShowUserInfo ] = useState(false);


    const [ messageRead, setMessageRead] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

    // 채팅방 생성 or 있으면 가져오기
    useEffect(() => {
        if(!senderInfo && !receiverInfo) return;

        const createChatRoom = async () => {
            try {
                const response = await postData("/chat/room", {
                    senderKey: senderInfo.userKey,
                    receiverKey: receiverInfo.userKey
                });
                setChatRoom(response.data);
            } catch {
                showToast("채팅방을 불러오지 못했습니다...", "error");
            }
        };
        createChatRoom();
    }, []);

    // 로그인한 유저에 따라 상대방 고르기
    useEffect(() => {
        if(!user && !senderInfo && !receiverInfo) return;

        if(user.userKey === senderInfo.userKey) {
            setChatUSerInfo(receiverInfo);
        } else if (user.userKey === receiverInfo.userKey) {
            setChatUSerInfo(senderInfo);
        }
    }, [user, sender, receiver])

    // 해당 채팅방의 메세지 가져오기
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
    }, [chatRoom, messageRead]);

    // 채팅방 WebSocket 연결
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

    // 메세지 읽음음 표시
    useEffect(() => {
        if(!chatRoom) return;

        const unreadMessages = messages.filter(
            m => m.receiverKey === user.userKey && !m.isRead
        );

        if(unreadMessages.length > 0) {
            markMessageAsRead(chatRoom.roomKey);
        }
    }, [messages]);

    const markMessageAsRead = async (roomKey) => {
        try {
            const response = await postData(`/chat/read/${roomKey}`);
            if(response.status === 200) setMessageRead(prev => !prev);
        } catch {
            showToast("통신 장애가 발생했습니다...", "error");
        }
    };

    const sendMessage = () => {
        if(input && clientRef.current?.connected && chatRoom) {
            const chatMessage = {
                senderKey: senderInfo.userKey,
                receiverKey: receiverInfo.userKey,
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
        if(!messages && !user) return;

        return (
        <>
        {messages.map(m => (
        <div key={m.id} 
        className={`chatMsg-box ${
            m.senderKey === 'SYSTEM' ? "system" :
            m.senderKey === user.userKey ? "sender" : "receiver"}`}>
            <div className={`chatMsg-label ${m.senderKey === user.userKey ? "sender" : "receiver"}`}>
                <span>{m.readAt ? "읽음" : ""}</span>
                <span>{getDayMinuteCounter(m.timestamp)}</span>
            </div>
            <pre className={`chatMsg-content-${
                m.senderKey === 'SYSTEM' ? "system" :
                m.senderKey === user.userKey ? "sender" : "receiver"}`}>
                {m.message}
            </pre>
        </div>
        ))}
        </>
        );
    }

    const handleKeyDown = (e) => {
        if(e.key === "Enter") {
            if(e.shiftKey) {
                e.preventDefault();
                setInput((prev) => prev + `\n`);
            } else {
                e.preventDefault();
                sendMessage();
            }
        }
    }

    const handleLeaveChat = async () => {
        if(!chatRoom) return;

        try {
            const response = await deleteData(`/chat/room/leave/${chatRoom.roomKey}`);
            if(response.status === 200) {
                showToast("채팅방을 나갔습니다.");
                navigate(0);
            }
        } catch (err) {
            showToast("통신 장애가 발생했습니다...", "error");
            console.log(err);
        }
    }

    if(!senderInfo && !receiverInfo && !clientRef) return;

    return (
        <>
        <div className='chat-room'>
            <div className='chat-menu-box'>
                {chatMenu && !showUserInfo ? 
                <div className='chat-menu'>
                    <button className='chat-menu-btn' onClick={() => setShowUserInfo(true)}>
                        <FaInfoCircle size={30} color='#7badff' />
                        <a>상대방 정보</a>
                    </button>
                    <button className='chat-menu-btn' onClick={() => setCloseChat(true)}>
                        <FaArrowCircleRight size={30} color='#555' />
                        <a>나가기</a>
                    </button>
                </div>
                : showUserInfo &&
                <div className='chat-userInfo-wrapper' onClick={() => navigate(`/user/${chatUserInfo.userKey}`)}>
                    {chatUserInfo &&
                    <img className='chat-userInfo-img'
                    src={chatUserInfo.userimg ? `http://localhost:8093${chatUserInfo.userimg}` : 'http://localhost:8093/item-images/temp/userImgTemp.png'}/>
                    }
                    <div className='chat-userInfo-box'>
                        <p className='chat-userInfo-text'>{chatUserInfo.useralias}</p>
                        <p className='chat-userInfo-text'>거래 : {chatUserInfo.tradecnt}</p>
                        <p className='chat-userInfo-text'>방문 : {chatUserInfo.visitcnt}</p>
                        <p className='chat-userInfo-text'>유저 신뢰도 표시 예정</p>
                    </div>
                    <button className='chat-userInfo-btn'>
                        <FaBullhorn size={30} color='#e53939' />
                        <a>신고하기</a>
                    </button>
                </div>
                }
                <button className='chat-user-btn' onClick={() => {setShowUserInfo(false); setChatMenu(prev => !prev)}}>
                    {chatMenu ? 
                    <FaAngleUp size={20} color='black' />
                    :
                    <FaAngleDown size={20} color='black'/>
                }
                </button>
            </div>
            <div className='chat-box'>
                {messages.length > 0 ? 
                ""
                :
                <span className='chat-span'>나눴던 대화가 없어요. 인사부터 시작해볼까요?</span>
            }
                {fetchMessages(messages)}
            </div>
            <div className='chat-input'>
                <textarea
                    className='chat-message'
                    value={input}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='메세지를 입력해주세요'
                    />
                <button className='chat-btn' onClick={sendMessage}>전송</button>
            </div>
        </div>
        <Modal
            isOpen={closeChat}
            onClose={() => setCloseChat(false)}
            onConfirm={handleLeaveChat}
            style='side-'
            title={"채팅방 나가기"}
            message={"해당 채팅방을 나가시겠어요?"}
            confirmText={"나가기"}
            cancelText={"머무르기"}
        />
        </>
    );
}

const getDayMinuteCounter = (date) => {
    if (!date) {return "";}

    let today = new Date();
    let postdate = new Date(date);
    let elapsedTime = Math.trunc((today - postdate) / 1000);
    let elapsedText = "";

    const seconds = 1;
    const minute = seconds * 60;
    const hour = minute * 60;
    const day = hour * 24;

    if (elapsedTime < minute) {
        elapsedText = "방금 전";
    } else if (elapsedTime < hour) {
        elapsedText = Math.trunc(elapsedTime / minute) + "분 전";
    } else if (elapsedTime < day) {
        elapsedText = Math.trunc(elapsedTime / hour) + "시간 전";
    } else {
        elapsedText = postdate.toLocaleDateString("ko-KR", {dateStyle: "medium",})
    }

    return elapsedText;
}

export default ChatRoom;