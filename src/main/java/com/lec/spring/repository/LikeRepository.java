package com.lec.spring.repository;

import com.lec.spring.DTO.ItemDTO;
import com.lec.spring.DTO.LikeDTO;
import com.lec.spring.domain.Like;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface LikeRepository {

    int addLike(Like like);

    int deleteLike(@Param("userKey")String userKey,
                   @Param("itemKey")Long itemKey);

    Like findLike(@Param("userKey")String userKey,
                  @Param("itemKey")Long itemKey);
}
