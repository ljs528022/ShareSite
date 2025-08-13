package com.lec.spring.service;

import com.lec.spring.domain.Notice;

import java.util.List;

public interface NoticeService {

    int write(Notice notice);

    int update(Notice notice);

    Notice findByNoticeKey(Long noticeKey);

    Notice findBySubject(String subject);

    List<Notice> findAll();

    void delete(Long noticeKey);
}
