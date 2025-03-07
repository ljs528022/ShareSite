package com.lec.spring.service;

import com.lec.spring.domain.Authority;
import com.lec.spring.domain.User;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

public interface UserService {

    // Search by UserKey
    User findbyUserKey (Long userKey);
    // Search by User ID
    User findbyUserName (String username);

    // Register
    int register (User user);

    // Auth as each UserKey
    List<Authority> selectAuthByUserKey (Long userKey);

    // -- User Page --
    User getUserByUserName(String username);
    User getUserByUserKey(Long userKey);
    void deleteAccount(Long userKey);
    void updatePassword(String newPassword, Long userKey);
    void updateTel(String newTel, Long userKey);



    // -- Admin Page --

}
