package com.lec.spring.service;

import com.lec.spring.domain.Post;

import java.util.List;
import java.util.Map;

public interface PostService {

    List<Post> getAllPosts();

    List<Post> getLatestPosts();

    // MAIN PAGE
    List<Map<String, Object>> getLatestPostsWithUsername();

    List<Map<String, Object>> findLikedPostsByUserId(Long user_id);



    // USER PAGE
    List<Post> getAllPostByUserId(Long user_);

    Post getPostByPostId(Long post_id);


    // ADMIN PAGE


}
