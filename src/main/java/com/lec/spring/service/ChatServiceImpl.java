package com.lec.spring.service;

import com.lec.spring.DTO.ChatMessageDTO;
import com.lec.spring.domain.ChatMessage;
import com.lec.spring.domain.ChatRoom;
import com.lec.spring.repository.ChatRepository;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public void markMessagesAsRead(String roomKey, String reader) {

    }
}
