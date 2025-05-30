import { useEffect, useState } from "react";
import { getData } from "../../services/api";

const ChatRoomList = ({  }) => {

    const [ chatRooms, setChatRooms ] = useState(null);

    useEffect(() => {
        const fetchChatRooms = async () => {
            const response = await getData("/chat/rooms", {

            });
            if(response.status === 200) {
                setChatRooms(response.data);
            }
        }
        fetchChatRooms();
    }, [])

    if(!chatRooms) return;

    return (
        <div>

        </div>
    );
}

export default ChatRoomList;