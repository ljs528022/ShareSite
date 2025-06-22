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
public class Review {

    private Long reviewKey;           // PK
    private String sellerKey;         // 판매자의 PK
    private String buyerKey;          // 구매자(로그인한 회원)의 PK
    private Long reviewScore;         // 간편 리뷰 & 점수
    private String reviewDetail;      // 자세한 리뷰
    private LocalDateTime writeDate;  // 리뷰 작성 날짜

}
