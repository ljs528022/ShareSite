package com.lec.spring.DTO;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long itemId;        // 구매한 상품의 PK
    private Long amount;        // 상품의 가격
    private String userId;      // 구매한 유저의 PK
    private Long tradeType;     // 거래 방법 0: 택배, 1: 직거래
    private String purType;     // 결제 방법
    private String location;    // 배송지 정보
}
