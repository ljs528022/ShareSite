package com.lec.spring.repository;

import com.lec.spring.DTO.ItemDTO;
import com.lec.spring.DTO.LikeDTO;
import com.lec.spring.domain.Like;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface LikeRepository {

    int addLike(Like like);

    int deleteLike(@Param("userKey")String userKey,
                   @Param("itemKey")Long itemKey);

    Like findLike(@Param("userKey")String userKey,
                  @Param("itemKey")Long itemKey);

    int countLike(@Param("itemKey")Long itemKey);

    List<Like> findByUserKey(@Param("userKey")String userKey);
}
