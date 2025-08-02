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
public class Notice {
    private Long noticeKey;             // 공지 글 번호
    private String subject;             // 공지 제목
    private String content;             // 공지 내용
    private LocalDateTime writeDate;    // 공지 작성일
}
