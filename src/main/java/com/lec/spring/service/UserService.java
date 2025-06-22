package com.lec.spring.service;

import com.lec.spring.DTO.LoginRequest;
import com.lec.spring.DTO.RegisterRequest;
import com.lec.spring.DTO.UserModifyRequest;
import com.lec.spring.domain.Authority;
import com.lec.spring.domain.User;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.Optional;

public interface UserService {

    // Search by UserKey
    User findByUserKey (String userKey);
    // Search by User ID
    User findByUserName (String username);

    List<User> findUsersByUserKeys(List<String> userKeys);

    User findSellerInfoByUserKey(String userKey);

    // ID Verification
    boolean isUsernameTaken(String username);

    // Register
    int register (RegisterRequest request);

    // Login
    String login(LoginRequest request);

    int modify(User user);

    // Verify Password
    boolean verifyPass(String userKey, String password);

    // Get Review's Users
    List<User> getReviewUsers(List<String> buyerKeys);

    // Get User's TrustScore
    double getTrustScore(String userKey);


    // For Modify User Info
    void deleteAccount(String userKey);
    void updatePassword(String newPassword, String userKey);
    void updateEmail(String newEmail, String userKey);



    // -- Admin Page --

}
