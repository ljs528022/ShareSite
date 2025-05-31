package com.lec.spring.controller;

import com.lec.spring.DTO.ChatMessageDTO;
import com.lec.spring.domain.ChatMessage;
import com.lec.spring.domain.ChatRoom;
import com.lec.spring.domain.User;
import com.lec.spring.service.ChatService;
import com.lec.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/chat")
@CrossOrigin(origins = "http://localhost:5178/")
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private ChatService chatService;
    @Autowired
    private UserService userService;

    @PostMapping("/room")
    public ResponseEntity<?> createChatRoom(@RequestBody Map<String, String> payload) {
        String senderKey = payload.get("senderKey");
        String receiverKey  = payload.get("receiverKey");

        ChatRoom room = chatService.createChatRoom(senderKey, receiverKey);
        return ResponseEntity.ok(room);
    }

    @GetMapping("/rooms")
    public ResponseEntity<?> getUserChatRooms(Principal principal) {
        User user = getUserByUsername(principal.getName());

        List<ChatRoom> rooms = chatService.getChatRoomsByUser(user.getUserKey());
        return ResponseEntity.ok(rooms);
    }

    @MessageMapping("/send/{roomKey}")
    public void sendMessage(@DestinationVariable String roomKey,
                                   @Payload ChatMessageDTO chatMessage,
                                   @Header("simpSessionAttributes")Map<String, Object> sessionAttributes) {

        String username = (String) sessionAttributes.get("username");
        User user = getUserByUsername(username);

        chatMessage.setSenderKey(user.getUserKey());
        chatMessage.setReceiverKey(chatMessage.getReceiverKey());
        chatMessage.setTimestamp(LocalDateTime.now());
        chatMessage.setReadAt(LocalDateTime.now());


        chatService.saveChatMessage(chatMessage);
        messagingTemplate.convertAndSend("/topic/chat/" + roomKey, chatMessage);
    }

    @GetMapping("/history/{roomKey}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable String roomKey) {
        List<ChatMessage> messages = chatService.findMessagesByRoomKey(roomKey);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/markAsRead/{roomKey}")
    public ResponseEntity<?> markAsRead(@PathVariable String roomKey, Principal principal) {
        User user = getUserByUsername(principal.getName());

        chatService.markMessagesAsRead(roomKey, user.getUserKey());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/room/leave/{roomKey}")
    public ResponseEntity<?> leaveRoom(@PathVariable String roomKey, Principal principal) {
        User user = getUserByUsername(principal.getName());
        chatService.leaveChatRoom(roomKey, user.getUserKey());
        return ResponseEntity.ok().build();
    }


    private User getUserByUsername(String username) {
        return userService.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("유저 정보를 찾을 수 없습니다.."));
    }
}