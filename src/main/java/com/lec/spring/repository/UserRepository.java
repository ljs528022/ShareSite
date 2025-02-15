package com.lec.spring.repository;

import com.lec.spring.domain.Post;
import com.lec.spring.domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserRepository {

    // Find User By UserNumber
    User findById(@Param("id") Long id);

    // Find User By User's ID
    User findByUsername(@Param("username") String username);

    List<User> findAll();


    // Register & Modify
    int join(User user);

    int update(User user);


    // User Page


}
