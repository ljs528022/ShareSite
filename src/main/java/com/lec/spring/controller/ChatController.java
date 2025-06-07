package com.lec.spring.controller;

import com.lec.spring.DTO.ChatMessageDTO;
import com.lec.spring.DTO.EnterDTO;
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
import java.util.*;
import java.util.stream.Collectors;

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
    public ResponseEntity<?> createChatRoom(@RequestBody Map<String, String> payload, Principal principal) {
        String senderKey = payload.get("senderKey");
        String receiverKey  = payload.get("receiverKey");
        User user = getUserByUsername(principal.getName());

        ChatRoom room = chatService.createChatRoom(senderKey, receiverKey, user.getUserKey());

        return ResponseEntity.ok(room);
    }

    @GetMapping("/rooms")
    public ResponseEntity<?> getUserChatRooms(Principal principal) {
        Map<String, Object> response = new HashMap<>();

        // 로그인한 유저가 있는 채팅방들
        User user = getUserByUsername(principal.getName());
        List<ChatRoom> rooms = chatService.getChatRoomsByUser(user.getUserKey());

        // 채팅방들의 상대방의 정보
        List<String> otherUserKeys = rooms.stream()
                .map(room -> {
                    if(room.getSenderKey().equals(user.getUserKey())) {
                        return room.getReceiverKey();
                    } else {
                        return room.getSenderKey();
                    }
                }).distinct().collect(Collectors.toList());
        List<User> otherUsers = userService.findUsersByUserKeys(otherUserKeys);

        // 채팅방들의 마지막 메세지
        List<String> roomKeys = rooms.stream().map(room -> room.getRoomKey()).collect(Collectors.toList());
        List<ChatMessage> lastMessages = chatService.getLastMessages(roomKeys);

        // 채팅방들의 안읽은 메세지 수
        List<Map<String, Integer>> unReadCounts = chatService.getCountUnread(roomKeys, user.getUserKey());
        System.out.println("받아온 Map의 값: " + unReadCounts);

        response.put("rooms", rooms);
        response.put("otherUsers", otherUsers);
        response.put("lastMessages", lastMessages);
        response.put("unReadCounts", unReadCounts);

        return ResponseEntity.ok(response);
    }

    @MessageMapping("/send/{roomKey}")
    public void sendMessage(@DestinationVariable("roomKey") String roomKey,
                                   @Payload ChatMessageDTO chatMessageDTO,
                                   @Header("simpSessionAttributes")Map<String, Object> sessionAttributes) {

        String username = (String) sessionAttributes.get("username");
        User user = getUserByUsername(username);

        if(!Objects.equals(user.getUserKey(), chatMessageDTO.getSenderKey())) {
            throw new IllegalArgumentException("보낸 사람 정보가 인증된 사용자와 일치하지 않습니다.");
        }

        chatMessageDTO.setRoomKey(roomKey);
        chatMessageDTO.setSenderKey(user.getUserKey());
        chatMessageDTO.setTimestamp(LocalDateTime.now());

        chatService.saveChatMessage(chatMessageDTO);
        messagingTemplate.convertAndSend("/topic/chat/" + roomKey, chatMessageDTO);
    }

    @MessageMapping("/chat/enter")
    public void handleUserEnter(@Payload EnterDTO enterDTO) {
        String roomKey = enterDTO.getRoomKey();
        String userKey = enterDTO.getUserKey();

        chatService.markMessagesAsRead(roomKey, userKey);
        messagingTemplate.convertAndSend(
                "/topic/readStatus/" + roomKey,
                Map.of("userKey", userKey, "roomKey", roomKey)
        );
    }

    @GetMapping("/history/{roomKey}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable("roomKey") String roomKey) {
        List<ChatMessage> messages = chatService.findMessagesByRoomKey(roomKey);
        return ResponseEntity.ok(messages);
    }

    @DeleteMapping("/room/leave/{roomKey}")
    public ResponseEntity<?> leaveRoom(@PathVariable("roomKey") String roomKey, Principal principal) {
        User user = getUserByUsername(principal.getName());
        chatService.leaveChatRoom(roomKey, user.getUserKey());

        ChatMessage leaveMessage = new ChatMessage();
        leaveMessage.setRoomKey(roomKey);
        leaveMessage.setSenderKey("SYSTEM");
        leaveMessage.setMessage(user.getUseralias() + "님이 채팅방을 나갔습니다.");

        messagingTemplate.convertAndSend("/topic/chat/" + roomKey, leaveMessage);

        return ResponseEntity.ok().build();
    }


    private User getUserByUsername(String username) {
        return userService.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("유저 정보를 찾을 수 없습니다.."));
    }
}