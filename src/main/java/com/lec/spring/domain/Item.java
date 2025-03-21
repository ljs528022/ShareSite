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
public class Item {

    private Long itemKey;                // Post PK
    private Long userKey;           // User PK(FK)
    private Long cateKey;       // Category PK(FK)
    private String subject;         // Subject NN
    private String content;         // Content
    private Long price;             // Price
    private String location;        // Location
    private String itemtype;        // item's type (NEW or OLD)
    private Long purtype;         // purchase type ( 1: POST, 2: TRADE, 3: BOTH )
    private Boolean tradeStatus;    // 0:In progress / 1:Done
    private LocalDateTime writeDate;// Write Date
    private Long viewcnt;           // View Count

    private String img1;
    private String img2;
    private String img3;
    private String img4;
    private String img5;

    private User user;
    private Category category;
}
