package com.lec.spring.repository;

import com.lec.spring.domain.Authority;
import com.lec.spring.domain.User;

import java.util.List;

public interface AuthorityRepository {

    // Search by Name
    Authority findByAuth(String Auth);

    // Search User's Auth
    List<Authority> findByUser (User user);

    // Change Auth
    int chAuth(Long userKey, Long authKey);
}
