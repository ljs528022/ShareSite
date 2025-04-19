package com.lec.spring.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ItemDTO {
    private Long userKey;
    private Long cateKey;
    private String subject;
    private String content;
    private Long price;
    private String location;
}
