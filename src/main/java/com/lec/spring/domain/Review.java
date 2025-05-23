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
    private Long sellerKey;         // 판매자의 PK
    private Long buyerKey;          // 구매자(로그인한 회원)의 PK
    private String reviewScore;     // 간편 리뷰 & 점수
    private String reviewDetail;    // 자세한 리뷰

}
