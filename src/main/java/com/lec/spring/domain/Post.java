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
public class Post {

    private Long id;                // Post PK
    private Long user_id;           // User PK(FK)
    private Long category_id;       // Category PK(FK)
    private String subject;         // Subject NN
    private String content;         // Content
    private Long price;             // Price
    private Boolean tradestatus;    // 0:In progress / 1:Done
    private LocalDateTime writeDate;// Write Date
    private Long viewcnt;           // View Count
}
