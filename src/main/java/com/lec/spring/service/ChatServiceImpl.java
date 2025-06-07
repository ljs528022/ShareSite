package com.lec.spring.service;

import com.lec.spring.DTO.ChatMessageDTO;
import com.lec.spring.domain.ChatMessage;
import com.lec.spring.domain.ChatRoom;
import com.lec.spring.repository.ChatRepository;
import com.lec.spring.repository.UserRepository;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    @Autowired
    public ChatServiceImpl(SqlSession sqlSession) {
        this.chatRepository = sqlSession.getMapper(ChatRepository.class);
        this.userRepository = sqlSession.getMapper(UserRepository.class);

        System.out.println("✅ ChatService() Created");
    }

    @Override
    public ChatRoom createChatRoom(String senderKey, String receiverKey, String userKey) {
        ChatRoom existingRoom = chatRepository.findRoomByUsers(senderKey, receiverKey);
        if(existingRoom != null) {
            if(senderKey == userKey && existingRoom.getSenderLeft()) {
                existingRoom.setSenderLeft(false);
                chatRepository.update(existingRoom);
            } else if (receiverKey == userKey && existingRoom.getReceiverLeft()) {
                existingRoom.setReceiverLeft(false);
                chatRepository.update(existingRoom);
            }
            return existingRoom;
        } else {
            String roomKey = UUID.randomUUID().toString();

            ChatRoom newRoom = new ChatRoom();
            newRoom.setRoomKey(roomKey);
            newRoom.setSenderKey(senderKey);
            newRoom.setReceiverKey(receiverKey);
            newRoom.setCreatedAt(LocalDateTime.now());
            newRoom.setSenderLeft(false);
            newRoom.setReceiverLeft(false);

            chatRepository.createChatRoom(newRoom);
            return newRoom;
        }
    }

    @Override
    public List<ChatRoom> getChatRoomsByUser(String userKey) {
        return chatRepository.getChatRoomsByUser(userKey);
    }

    @Override
    public void saveChatMessage(ChatMessageDTO chatMessageDTO) {
        ChatMessage message =  new ChatMessage();
        message.setRoomKey(chatMessageDTO.getRoomKey());
        message.setSenderKey(chatMessageDTO.getSenderKey());
        message.setReceiverKey(chatMessageDTO.getReceiverKey());
        message.setMessage(chatMessageDTO.getMessage());
        message.setReadAt(chatMessageDTO.getReadAt());
        message.setTimestamp(chatMessageDTO.getTimestamp());
        message.setIsRead(false);

        chatRepository.saveChatMessage(message);
    }

    @Override
    public List<ChatMessage> findMessagesByRoomKey(String roomKey) {
        return chatRepository.findMessagesByRoomKey(roomKey);
    }

    @Override
    public List<ChatMessage> getLastMessages(List<String> roomKeys) {
        return chatRepository.getLastMessages(roomKeys);
    }

    @Override
    public List<Map<String, Integer>> getCountUnread(List<String> roomKeys, String userKey) {
        return chatRepository.getCountUnread(roomKeys, userKey);
    }

    @Override
    public void markMessagesAsRead(String roomKey, String userKey) {
        chatRepository.markMessagesAsRead(roomKey, userKey, LocalDateTime.now());
    }

    @Override
    public void leaveChatRoom(String roomKey, String userKey) {
        ChatRoom room = chatRepository.findByRoomKey(roomKey);
        if(userKey.equals(room.getSenderKey())) {
            room.setSenderLeft(true);
        } else if (userKey.equals(room.getReceiverKey())) {
            room.setReceiverLeft(true);
        }

        if(room.getSenderLeft() && room.getReceiverLeft()) {
            chatRepository.delete(roomKey);
        } else {
            chatRepository.update(room);
        }
    }
}
