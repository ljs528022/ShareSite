package com.lec.spring.service;

import com.lec.spring.domain.Notice;
import com.lec.spring.repository.LocationRepository;
import com.lec.spring.repository.NoticeRepository;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeServiceImpl implements NoticeService {

    private NoticeRepository noticeRepository;

    @Autowired
    public NoticeServiceImpl(SqlSession sqlSession) {
        this.noticeRepository = sqlSession.getMapper(NoticeRepository.class);

        System.out.println("✅ NoticeService() Created");
    }

    @Override
    public int write(Notice notice) {
        return noticeRepository.write(notice);
    }

    @Override
    public int update(Notice notice) {
        return noticeRepository.update(notice);
    }

    @Override
    public Notice findByNoticeKey(Long noticeKey) {
        return noticeRepository.findByNoticeKey(noticeKey);
    }

    @Override
    public Notice findBySubject(String subject) {
        return noticeRepository.findBySubject(subject);
    }

    @Override
    public List<Notice> findAll() {
        return noticeRepository.findAll();
    }

    @Override
    public void delete(Long noticeKey) {
        noticeRepository.delete(noticeKey);
    }
}
