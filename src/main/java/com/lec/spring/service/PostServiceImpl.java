package com.lec.spring.service;

import com.lec.spring.domain.Post;
import com.lec.spring.repository.PostRepository;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PostServiceImpl implements PostService{

    @Value("${app.pagination.write_pages}")
    private int WRITE_PAGES;
    @Value("${app.pagination.page_rows}")
    private int PAGE_ROWS;

    private final PostRepository postRepository;

    @Autowired
    public PostServiceImpl(SqlSession sqlSession){
        this.postRepository = sqlSession.getMapper(PostRepository.class);
        System.out.println("[SERVICEIMPL] PostServiceImpl Init");
    }

    @Override
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    @Override
    public List<Post> getLatestPosts() {
        return postRepository.findLastest();
    }


    // USER PAGE
    @Override
    public List<Map<String, Object>> getLatestPostsWithUsername() {

        return null;
    }

    @Override
    public List<Map<String, Object>> findLikedPostsByUserId(Long user_id) {
        return null;
    }

    @Override
    public List<Post> getAllPostByUserId(Long user_) {
        return null;
    }

    @Override
    public Post getPostByPostId(Long post_id) {
        return null;
    }
}
