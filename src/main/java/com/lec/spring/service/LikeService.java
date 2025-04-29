package com.lec.spring.service;

import com.lec.spring.DTO.LikeDTO;
import com.lec.spring.domain.Like;
import org.springframework.stereotype.Service;

public interface LikeService {

    int addLike (Like like);

    int deleteLike (String userKey, Long itemKey);

    Like findLike (String userKey, Long itemKey);

    int countLike(Long itemKey);

}
