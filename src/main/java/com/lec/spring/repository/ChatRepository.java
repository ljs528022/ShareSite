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

    void saveChatMessage(ChatMessage chatMessage);

    List<ChatMessage> findMessagesByRoomKey(String roomKey);

}
