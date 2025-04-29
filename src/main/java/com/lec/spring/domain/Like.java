package com.lec.spring.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Like {

    private Long wishKey;       // PK
    private String userKey;       // user's PK (FK)
    private Long itemKey;       // item's PK (FK)

}
