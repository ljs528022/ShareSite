package com.lec.spring.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ItemImage {

    private Long imageKey;      // Image's PK
    private Long itemKey;       // Item's PK (FK)
    private String imgUrl;      // Image's URL
    private Boolean isMain;     // is Thumbnail ? true or false

}
