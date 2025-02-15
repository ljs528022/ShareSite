package com.lec.spring.repository;

import com.lec.spring.domain.Post;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface PostRepository {

    int save(Post post);

    Post findByPostId(Long id);

    int incViewcnt(Long id);

    List<Post> findAll();

    List<Post> findLastest();

    int modify(Post post);

    int chPostState(Long id);

    int delete(Post post);


    // USER PAGE
    List<Map<String, Object>> findLatestPostsWithUsername();


    // ADMIN PAGE

}
