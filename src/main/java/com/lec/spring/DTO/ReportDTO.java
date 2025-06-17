package com.lec.spring.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReportDTO {
    private String reporterKey;         // 신고자 PK
    private String targetKey;           // 신고 대상 PK
    private Long reason;                // 신고 이유
    private String content;             // 신고 내용
}
