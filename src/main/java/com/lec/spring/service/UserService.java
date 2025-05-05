package com.lec.spring.service;

import com.lec.spring.DTO.LoginRequest;
import com.lec.spring.DTO.RegisterRequest;
import com.lec.spring.domain.Authority;
import com.lec.spring.domain.User;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.Optional;

public interface UserService {

    // Search by UserKey
    User findByUserKey (String userKey);
    // Search by User ID
    Optional<User> findByUserName (String username);

    User findSellerInfoByUserKey(String userKey);

    // ID Verification
    boolean isUsernameTaken(String username);

    // Register
    int register (RegisterRequest request);

    // Login
    String login(LoginRequest request);

    // Auth as each UserKey
    List<Authority> selectAuthByUserKey (String userKey);

    // -- User Page --
    User getUserByUserName(String username);
    User getUserByUserKey(String userKey);
    void deleteAccount(String userKey);
    void updatePassword(String newPassword, String userKey);
    void updateEmail(String newEmail, String userKey);



    // -- Admin Page --

}
