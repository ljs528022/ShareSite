package com.lec.spring.repository;

import com.lec.spring.domain.Notice;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface NoticeRepository {

    int write(Notice notice);

    int update(Notice notice);

    Notice findByNoticeKey(@Param("noticeKey")Long noticeKey);

    List<Notice> findAll();

    void delete(@Param("noticeKey")Long noticeKey);
}
