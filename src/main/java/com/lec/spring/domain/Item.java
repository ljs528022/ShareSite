package com.lec.spring.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties({"user", "category"})
public class Item {

    private Long itemKey;                // Post PK
    private String userKey;           // User PK(FK)
    private Long cateKey;       // Category PK(FK)
    private String subject;         // Subject NN
    private String content;         // Content
    private Long price;             // Price
    private String itemtype;        // item's type (NEW or OLD)
    private Long purtype;         // purchase type ( 1: POST, 2: TRADE, 3: BOTH )
    private Boolean tradestatus;    // false: In progress / true:Done
    private LocalDateTime writeDate;// Write Date
    private Long viewcnt;           // View Count
}
