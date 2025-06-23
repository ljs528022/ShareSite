package com.lec.spring.repository;

import com.lec.spring.domain.Item;
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
    User findByUserName(@Param("username") String username);

    User findByUseralias(@Param("useralias")String useralias);

    User findByEmail(@Param("email")String email);

    List<User> findUsersByUserKeys(List<String> userKeys);

    // ID Verification
    int existsByUsername(@Param("username") String username);

    Long countByUserKeyStartWith(@Param("dataPrefix") String dataPrefix);

    // Register New User
    int register(User user);

    // Update User Info
    int update(User user);

    // Get Item Seller's UserInfo
    User findSellerInfoByUserKey(@Param("userKey")String userKey);

    // -- User Page --

    // Delete Account
    void changeUserStateToStop(@Param("userKey") String userKey);

    // Search All User
    List<User> findAll();

    void includeVisitCnt(@Param("username")String username);

    void includeTradeCnt(@Param("userKey")String userKey);

    List<User> getReviewUsers(List<String> buyerKeys);
}
