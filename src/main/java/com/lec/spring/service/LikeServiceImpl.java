package com.lec.spring.service;

import com.lec.spring.DTO.ItemDTO;
import com.lec.spring.DTO.LocationDTO;
import com.lec.spring.domain.ItemImage;
import com.lec.spring.domain.Like;
import com.lec.spring.repository.ItemRepository;
import com.lec.spring.repository.LikeRepository;
import com.lec.spring.repository.LocationRepository;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LikeServiceImpl implements LikeService {

    private LikeRepository likeRepository;
    private LocationRepository locationRepository;
    private ItemRepository itemRepository;

    @Autowired
    public LikeServiceImpl(SqlSession sqlSession) {
        this.likeRepository = sqlSession.getMapper(LikeRepository.class);
        this.locationRepository = sqlSession.getMapper(LocationRepository.class);
        this.itemRepository = sqlSession.getMapper(ItemRepository.class);

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

    @Override
    public int countLike(Long itemKey) {
        return likeRepository.countLike(itemKey);
    }

    @Override
    public List<Like> findByUserKey(String userKey) {
        return likeRepository.findByUserKey(userKey);
    }
}
