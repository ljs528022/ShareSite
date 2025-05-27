package com.lec.spring.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewDTO {
    private String sellerKey;           // 판매자의 PK
    private String buyerKey;            // 구매자(로그인한 회원)의 PK
    private String reviewScore;         // 간편 리뷰 & 점수
    private String reviewDetail;        // 자세한 리뷰
    private LocalDateTime writeDate;    // 리뷰 작성 날짜
}
