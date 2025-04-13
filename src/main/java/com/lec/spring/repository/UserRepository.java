package com.lec.spring.repository;

import com.lec.spring.DTO.RegisterRequest;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.Like;
import com.lec.spring.domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserRepository {

    // Return User By userKey
    User findByUserKey(@Param("userKey") String userKey);

    // Return User By username
    Optional<User> findByUserName(@Param("username") String username);

    // ID Verification
    boolean existsByUsername(@Param("username") String username);

    Long countByUserKeyStartWith(@Param("dataPrefix") String dataPrefix);

    // Register New User
    int register(User user);

    // Update User Info
    int update(User user);


    // -- User Page --

    // Get All User's Item
    List<Item> findAllItemByUserKey(@Param("userKey")String userKey);

    // User's Item Count
    int userItemCountAll(@Param("userKey")String userKey);

    // User's Trading Item Count
    int userItemTradingCountAll(@Param("userKey")String userKey);

    // User's Traded Item Count
    int userItemTradedCountAll(@Param("userKey")String userKey);

    // User's Review Count
    int userReviewCountAll(@Param("userKey")String userKey);

    // Change User's Password
    void updatePassword(
            @Param("newPassword") String newPassword,
            @Param("userKey") String userKey
    );

    // Change Phone Number
    void updateEmail(
            @Param("newEmail") String newEmail,
            @Param("userKey") String userKey
    );

    // Delete Account
    void deleteAccount(
            @Param("userKey") String userKey
    );

    // Get User's Like
    List<Item> findLikeByUserKey(@Param("userKey") String userKey);

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
