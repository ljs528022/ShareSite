import { useEffect, useState } from "react";
import { getData } from "../../services/api";
import { useUser } from "../../services/UserContext";
import { useToast } from "../../util/ToastContext";

const ChatRoomList = () => {

    const { user } = useUser();

    const [ chatRooms, setChatRooms ] = useState(null);
    const [ otherUser, setOtherUser ] = useState(null);
    const [ recentMessage, setRecentMessage ] = useState(null);
    const [ unReadCount, setUnReadCount ] = useState(0);

    const { showToast } = useToast();

    useEffect(() => {
        const getChatRooms = async () => {
            const response = await getData("/chat/rooms");
            if(response.status === 200) {
                const { rooms, otherUsers, lastMessages } = response.data;
                setChatRooms(rooms);
                setOtherUser(otherUsers);
                setRecentMessage(lastMessages);
            }
        };
        getChatRooms();
    }, []);

    const handleOpenChat = () => {
        
    }

    const fetchChatRooms = (rooms, users) => {
        if(!rooms && !users) return;

        const userKey = user.userKey

        return (
            <div className="chatRoom-wrapper">
            {rooms.map(room => {
                const otherUserKey = room.senderKey === userKey ? room.receiverKey : room.senderKey;
                const chatOhterUser = users.find(user => user.userKey === otherUserKey);
                const msg = recentMessage.find(msg => msg.roomKey === room.roomKey);

                return (
                <div key={room.roomKey} className="chatRoom-box" >
                    <img className="chatRoom-img" src={chatOhterUser.userimg ? `http://localhost:8093${chatOhterUser.userimg}` : 'http://localhost:8093/item-images/temp/userImgTemp.png'} />
                    <div className="chatRoom-info">
                        <p className="chatRoom-label">{chatOhterUser.useralias}</p>
                        <p className="chatRoom-content">{!msg ? "나눈 대화가 없습니다" : msg.message}</p>
                    </div>
                    <div className="chatRoom-sub">
                        <p className="chatRoom-time">
                            {msg && getDayMinuteCounter(msg.timestamp)}
                        </p>
                        <p className="chatRoom-unread">
                            {unReadCount === 0 ? "" : unReadCount}
                        </p>
                    </div>
                </div>
                )
            })}
            </div>
        )
    }

    if(!chatRooms && !otherUser) return;

    return (
        <>
        {fetchChatRooms(chatRooms, otherUser)}
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

export default ChatRoomList;