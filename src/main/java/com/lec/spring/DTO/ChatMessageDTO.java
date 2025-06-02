package com.lec.spring.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessageDTO {
    private String roomKey;
    private String senderKey;
    private String receiverKey;
    private String message;
    private LocalDateTime readAt;
    private LocalDateTime timestamp;
}
