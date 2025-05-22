package com.lec.spring.DTO;

import lombok.Data;

@Data
public class PaymentCompleteRequest {
    private String orderId;             // 상품 결제 번호
    private PaymentRequest paymentData; // 결제 내역
}
