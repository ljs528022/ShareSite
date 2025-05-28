package com.lec.spring.controller;

import com.lec.spring.DTO.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5178/")
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/send")
    @SendTo("/topic/room/{roomKey}")
    public ChatMessage sendMessage(@DestinationVariable String roomKey, ChatMessage message) {
        return message;
    }

    @MessageMapping("/chat/message")
    public void message(ChatMessage message) {
        if(message.getType() == ChatMessage.MessageType.ENTER) {
            message.setMessage((message.getSender()) + "님이 입장했습니다.");
        }
        messagingTemplate.convertAndSend("/sub/chat/room/" + message.getRoomKey());
    }
}
