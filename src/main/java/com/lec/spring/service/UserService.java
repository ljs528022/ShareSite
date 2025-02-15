package com.lec.spring.service;

import com.lec.spring.domain.Authority;
import com.lec.spring.domain.Post;
import com.lec.spring.domain.User;

import java.util.List;

public interface UserService {

    // request User Info by User's id
    User findByUsername (String username);
    User findById (Long id);

    // Register
    int register(User user);

    // Authority By ID
    List<Authority> selectAuthById (Long id);

    // -----------------------------------
    // ADMIN page
    List<User> getAllUsers();

    List<Post> getAllPosts();



}
