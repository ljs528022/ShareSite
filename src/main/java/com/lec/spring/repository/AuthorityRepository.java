package com.lec.spring.repository;

import com.lec.spring.domain.Authority;
import com.lec.spring.domain.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AuthorityRepository {

    // Search by Name
    Authority findByAuth(String Auth);

    // Search User's Auth
    List<Authority> findByUser (User user);

    // Change Auth
    int chAuth(Long userKey, Long authKey);
}
