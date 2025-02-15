package com.lec.spring.domain;

import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
    private boolean tradestatus;    // 0:In progress / 1:Done
    private LocalDateTime writeDate;// Write Date
    private Long viewcnt;           // View Count

    private User user;
    private Category category;
    private Attachment attachment;

    // User Page - Selling Items


    // Attachment
    @ToString.Exclude
    @Builder.Default
    private List<Attachment> fileList = new ArrayList<>();
}
