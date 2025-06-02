package com.lec.spring.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatRoom {
    private String roomKey;
    private String senderKey;
    private String receiverKey;
    private LocalDateTime createdAt;

    private Boolean senderLeft;
    private Boolean receiverLeft;
}
