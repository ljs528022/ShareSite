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
public class ChatMessage {
    private int id;
    private String roomKey;
    private String senderKey;
    private String receiverKey;
    private String message;
    private LocalDateTime readAt;
    private LocalDateTime timestamp;

    private boolean isRead;
}
