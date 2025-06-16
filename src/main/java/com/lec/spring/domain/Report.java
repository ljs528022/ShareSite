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
public class Report {
    private String reportKey;           // 신고 번호
    private String reporterKey;         // 신고자 PK
    private String targetKey;           // 신고 대상 PK
    private Long reason;                // 신고 이유
    private String content;             // 신고 내용
    private LocalDateTime createdAt;    // 신고 날짜
}
