package com.lec.spring.service;

import com.lec.spring.DTO.LikeDTO;
import com.lec.spring.domain.Like;
import com.lec.spring.repository.LikeRepository;
import com.lec.spring.repository.LocationRepository;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeServiceImpl implements LikeService {

    private LikeRepository likeRepository;

    @Autowired
    public LikeServiceImpl(SqlSession sqlSession) {
        this.likeRepository = sqlSession.getMapper(LikeRepository.class);

        System.out.println("✅ LikeService() Created");
    }

    @Override
    public int addLike(Like like) {
        return likeRepository.addLike(like);
    }

    @Override
    public int deleteLike(String userKey, Long itemKey) {
        return likeRepository.deleteLike(userKey, itemKey);
    }

    @Override
    public Like findLike(String userKey, Long itemKey) {
        return likeRepository.findLike(userKey, itemKey);
    }
}
