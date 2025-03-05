package com.lec.spring.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Purchase {

    private Long purchaseKey;       // PK
    private Long userKey;           // user's PK (FK)
    private String bank;            // Bank name
    private String bankNum;         // Bank Account Number

}
