package com.lec.spring.repository;

import com.lec.spring.domain.ChatMessage;
import com.lec.spring.domain.ChatRoom;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ChatRepository {

    int createChatRoom(ChatRoom chatRoom);

    List<ChatRoom> getChatRoomsByUser(@Param("userKey")String userKey);

    ChatRoom findRoomByUsers(@Param("senderKey")String senderKey, @Param("receiverKey")String receiverKey);

    ChatRoom findByRoomKey(@Param("roomKey")String roomKey);

    void saveChatMessage(ChatMessage chatMessage);

    List<ChatMessage> findMessagesByRoomKey(String roomKey);

    int countUsersInRoom(@Param("roomKey")String roomKey);

    void markMessagesAsRead(@Param("roomKey")String roomKey, @Param("userKey")String userKey);
    void update(ChatRoom room);
    void delete(@Param("roomKey")String roomKey);

}
