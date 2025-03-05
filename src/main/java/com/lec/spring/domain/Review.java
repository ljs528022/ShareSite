package com.lec.spring.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Review {

    private Long reviewKey;         // PK
    private Long userKey;           // user's PK (FK)
    private Long itemKey;           // item's PK (FK)
    private String reviewtag;       // Compact Review
    private String content;         // Detail Review

}
