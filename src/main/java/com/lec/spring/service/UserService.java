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
    User findbyUserKey (Long userKey);
    // Search by User ID
    Optional<User> findbyUserName (String username);

    // ID Verification
    boolean isUsernameTaken(String username);

    // Register
    int register (RegisterRequest request);

    // Login
    String login(LoginRequest request);

    // Auth as each UserKey
    List<Authority> selectAuthByUserKey (Long userKey);

    // -- User Page --
    User getUserByUserName(String username);
    User getUserByUserKey(Long userKey);
    void deleteAccount(Long userKey);
    void updatePassword(String newPassword, Long userKey);
    void updateEmail(String newEmail, Long userKey);



    // -- Admin Page --

}
