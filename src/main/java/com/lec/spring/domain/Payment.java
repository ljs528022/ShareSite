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

    private String orderKey;            // 거래 주문 번호 (PK)
    private String sellerKey;           // 판매자 PK (FK)
    private String buyerKey;            // 구매자 PK (FK)
    private Long itemKey;               // 판매, 구매한 상품 PK (FK)
    private String location;            // 상품 배송지
    private Long tradeType;             // 상품을 거래한 방식 -> 0: 택배, 1: 직거래
    private String purType;             // 상품을 구매한 방식
    private Long price;                 // 결제한 금액
    private LocalDateTime purchaseDate; // 상품을 구매한 날짜
    private Boolean confirmed;          // 거래 확정 확인 값


}
