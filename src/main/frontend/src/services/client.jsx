import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const socket = new SockJS('http://localhost:8093/ws-chat');
const client = new Client({
    webSocketFactory: () => socket,
    onConnect: () => {
        client.subscribe('/sub/chat/room/room123', message => {
            const chat = JSON.parse(message.body);
            console.log("받은 메세지: ", chat);
        });

        client.publish({
            destination: '/pub/chat/message',
            body: JSON.stringify({
                type: "ENTER",
                roomKey: "room123",
                sender: "user1",
                message: ""
            })
        });
    }
});
client.activate();