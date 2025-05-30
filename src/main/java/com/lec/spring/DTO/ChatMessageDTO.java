package com.lec.spring.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
public class ChatMessageDTO {
    private String roomKey;
    private String senderKey;
    private String message;
    private LocalDateTime readAt;
    private LocalDateTime timestamp;
}
