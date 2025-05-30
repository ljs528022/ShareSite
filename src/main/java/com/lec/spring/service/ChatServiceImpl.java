package com.lec.spring.service;

import com.lec.spring.DTO.ChatMessageDTO;
import com.lec.spring.domain.ChatMessage;
import com.lec.spring.domain.ChatRoom;
import com.lec.spring.repository.ChatRepository;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ChatServiceImpl implements ChatService{

    private ChatRepository chatRepository;

    @Autowired
    public ChatServiceImpl(SqlSession sqlSession) {
        this.chatRepository = sqlSession.getMapper(ChatRepository.class);

        System.out.println("✅ ChatService() Created");
    }

    @Override
    public ChatRoom createChatRoom(String senderKey, String receiverKey) {
        ChatRoom existingRoom = chatRepository.findRoomByUsers(senderKey, receiverKey);
        if(existingRoom != null) return existingRoom;

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

    @Override
    public List<ChatRoom> getChatRoomsByUser(String userKey) {
        return chatRepository.getChatRoomsByUser(userKey);
    }

    @Override
    public void saveChatMessage(ChatMessageDTO chatMessage) {
        ChatMessage message =  new ChatMessage();
        message.setRoomKey(chatMessage.getRoomKey());
        message.setSenderKey(chatMessage.getSenderKey());
        message.setReceiverKey(chatMessage.getReceiverKey());
        message.setMessage(chatMessage.getMessage());
        message.setReadAt(chatMessage.getReadAt());
        message.setTimestamp(chatMessage.getTimestamp());
        message.setRead(false);

        chatRepository.saveChatMessage(message);
    }

    @Override
    public List<ChatMessage> findMessagesByRoomKey(String roomKey) {
        return chatRepository.findMessagesByRoomKey(roomKey);
    }

    @Override
    public void markMessagesAsRead(String roomKey, String userKey) {
        chatRepository.markMessagesAsRead(roomKey, userKey);
    }

    @Override
    public void leaveChatRoom(String roomKey, String userKey) {
        ChatRoom room = chatRepository.findByRoomKey(roomKey);
        if(userKey.equals(room.getSenderKey())) {
            room.setSenderLeft(true);
        } else if (userKey.equals(room.getReceiverKey())) {
            room.setReceiverLeft(true);
        }

        if(room.isSenderLeft() && room.isReceiverLeft()) {
            chatRepository.delete(roomKey);
        } else {
            chatRepository.update(room);
        }
    }
}
