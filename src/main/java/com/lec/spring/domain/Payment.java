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
public class Payment {

    private String sellerKey;           // 판매자 PK
    private String buyerKey;            // 구매자 PK
    private Long itemKey;               // 판매, 구매한 상품 PK
    private String location;            // 상품 배송지
    private Long tradeType;             // 상품을 거래한 방식 -> 0: 택배, 1: 직거래
    private String purType;             // 상품을 구매한 방식
    private LocalDateTime purchaseDate; // 상품을 구매한 날짜

}
