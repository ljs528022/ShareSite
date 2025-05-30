package com.lec.spring.service;

import com.lec.spring.DTO.ChatMessageDTO;
import com.lec.spring.domain.ChatMessage;
import com.lec.spring.domain.ChatRoom;

import java.util.List;

public interface ChatService {

    ChatRoom createChatRoom(String senderKey, String receiverKey);

    List<ChatRoom> getChatRoomsByUser(String userKey);

    void saveChatMessage(ChatMessageDTO chatMessage);

    List<ChatMessage> findMessagesByRoomKey(String roomKey);

    void markMessagesAsRead(String roomKey, String reader);

    void leaveChatRoom(String roomKey, String userKey);
}
