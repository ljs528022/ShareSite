package com.lec.spring.repository;

import com.lec.spring.domain.Item;
import com.lec.spring.domain.Like;
import com.lec.spring.domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserRepository {

    // Return User By userKey
    User findByUserKey(@Param("userKey") Long userKey);

    // Return User By username
    User findByUserName(@Param("username") String username);

    Long countByUserKeyStartWith(@Param("dataPrefix") String dataPrefix);

    // Regist New User
    int join(User user);

    // Update User Info
    int update(User user);


    // -- User Page --

    // Get All User's Item
    List<Item> findAllItemByUserKey(@Param("userKey")Long userKey);

    // User's Item Count
    int userItemCountAll(@Param("userKey")Long userKey);

    // User's Trading Item Count
    int userItemTradingCountAll(@Param("userKey")Long userKey);

    // User's Traded Item Count
    int userItemTradedCountAll(@Param("userKey")Long userKey);

    // User's Review Count
    int userReviewCountAll(@Param("userKey")Long userKey);

    // Change User's Password
    void updatePassword(
            @Param("newPassword") String newPassword,
            @Param("userKey") Long userKey
    );

    // Change Phone Number
    void updateTel(
            @Param("newTel") String newTel,
            @Param("userKey") Long userKey
    );

    // Delete Account
    void deleteAccount(
            @Param("userKey") Long userKey
    );

    // Get User's Like
    List<Item> findLikeByUserKey(@Param("userKey") Long userKey);

    // Pagination
    List<User> searchWithPaging();


    // -- Admin Page --

    // Search All User
    List<User> findAll();

    // Search Latest 5 USer
    List<User> findLatestUser();

    // List All Users
    List<User> userList();



}
