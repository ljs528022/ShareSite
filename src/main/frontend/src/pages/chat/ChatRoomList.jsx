import { useEffect, useState } from "react";
import { getData } from "../../services/api";
import { useUser } from "../../services/UserContext";
import ChatRoom from "../../pages/chat/ChatRoom";
import { FaAngleRight } from "react-icons/fa";
import '../../css/util/chatroom.css';

const ChatRoomList = ({ onClose }) => {

    const { user } = useUser();

    const [ chatRooms, setChatRooms ] = useState(null);
    const [ otherUser, setOtherUser ] = useState(null);
    const [ recentMessage, setRecentMessage ] = useState(null);
    const [ unReadCount, setUnReadCount ] = useState(null);

    const [ selectedRoom, setSelectedRoom ] = useState(null);

    const [ chatPage, setChatPage ] = useState(0);

    useEffect(() => {
        const getChatRooms = async () => {
            const response = await getData("/chat/rooms");
            if(response.status === 200) {
                const { rooms, otherUsers, lastMessages, unReadCounts } = response.data;
                setChatRooms(rooms);
                setOtherUser(otherUsers);
                setRecentMessage(lastMessages);
                setUnReadCount(unReadCounts);
            }
        };
        getChatRooms();
    }, []);

    const handleOpenChat = (room) => {
        if(!room) return;

        setSelectedRoom({
            roomKey: room.roomKey,
            sender: user,
            receiver: otherUser.find(o => room.senderKey === o.userKey || room.receiverKey === o.userKey)
        });
        setChatPage(1);
    }

    const fetchChatRooms = (rooms, users) => {
        if(!rooms && !users) return;

        const userKey = user.userKey;

        return (
            <>
            {rooms.map(room => {
                const otherUserKey = room.senderKey === userKey ? room.receiverKey : room.senderKey;
                const chatOhterUser = users.find(user => user.userKey === otherUserKey);
                const msg = recentMessage.find(msg => msg.roomKey === room.roomKey);
                const unRead = unReadCount.find(un => un.roomKey === room.roomKey);

                return (
                <div key={room.roomKey} className="chatRoom-box" onClick={() => handleOpenChat(room)}>
                    <img className="chatRoom-img" src={chatOhterUser.userimg ? `http://localhost:5178${chatOhterUser.userimg}` : 'http://localhost:5178/uploads/item-images/temp/userImgTemp.png'} />
                    <div className="chatRoom-info">
                        <p className="chatRoom-label">{chatOhterUser.useralias}</p>
                        <p className="chatRoom-content">{!msg ? "나눈 대화가 없습니다" : msg.message}</p>
                    </div>
                    <div className="chatRoom-sub">
                        {msg &&
                        <p className="chatRoom-time">
                            {getDayMinuteCounter(msg.timestamp)}
                        </p>
                        }
                        {unRead &&
                        <p className="chatRoom-unread">
                            {unRead.unreadCount}
                        </p>
                        }
                    </div>
                </div>
                )
            })}
            </>
        )
    }

    if(!chatRooms && !otherUser) return;

    return (
        <div className="chatRoom-wrapper">
            <div className="chat-header">
                <button type="button" onClick={onClose}>
                    <FaAngleRight size={35} />
                </button>
                <label>{"채팅방 목록"}</label>
            </div>
            <>
            {chatPage === 0 &&
            fetchChatRooms(chatRooms, otherUser)
            }
            </>
            {chatPage === 1 && selectedRoom && (
                <ChatRoom
                    sender={selectedRoom.sender}
                    receiver={selectedRoom.receiver}
                    onBack={() => setChatPage(0)}
                />
            )}
            
        </div>
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

export default ChatRoomList;