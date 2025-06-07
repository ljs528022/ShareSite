package com.lec.spring.service;

import com.lec.spring.DTO.ChatMessageDTO;
import com.lec.spring.domain.ChatMessage;
import com.lec.spring.domain.ChatRoom;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface ChatService {

    ChatRoom createChatRoom(String senderKey, String receiverKey, String userKey);

    List<ChatRoom> getChatRoomsByUser(String userKey);

    void saveChatMessage(ChatMessageDTO chatMessage);

    List<ChatMessage> findMessagesByRoomKey(String roomKey);

    List<ChatMessage> getLastMessages(List<String> roomKeys);

    List<Map<String, Integer>> getCountUnread(List<String> roomKeys, String userKey);

    void markMessagesAsRead(String roomKey, String reader);

    void leaveChatRoom(String roomKey, String userKey);
}
