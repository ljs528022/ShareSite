package com.lec.spring.repository;

import com.lec.spring.domain.Item;
import com.lec.spring.domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Mapper
public interface UserRepository {

    // Return User By userKey
    User findByUserKey(@Param("userKey") String userKey);

    // Return User By username
    User findByUserName(@Param("username") String username);

    Optional<User> findByUsernameOrEmail(@Param("username")String username, @Param("email")String email);

    User findByUseralias(@Param("useralias")String useralias);

    User findByEmail(@Param("email")String email);

    List<User> findUsersByUserKeys(List<String> userKeys);

    // ID Verification
    int existsByUsername(@Param("username") String username);

    Long countByUserKeyStartWith(@Param("dataPrefix") String dataPrefix);

    // Register New User
    int signup(User user);

    // Social Register
    int socialSignup(User user);

    // Update User Info
    int update(User user);

    // Get Item Seller's UserInfo
    User findSellerInfoByUserKey(@Param("userKey")String userKey);

    // -- User Page --

    // Change User State
    void changeUserState(@Param("userKey")String userKey, @Param("state")String state, @Param("time")LocalDateTime time);

    // Search All User
    List<User> findAll();

    void includeVisitCnt(@Param("username")String username);

    void includeTradeCnt(@Param("userKey")String userKey);

    List<User> getReviewUsers(List<String> buyerKeys);

    // 탈퇴 예정(R)인 유저가 그 상태로 7일이 지나면 탈퇴 상태(S)로 변경
    void withdrawOver7Days();
}
