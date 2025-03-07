package com.lec.spring.config;

import com.lec.spring.domain.Authority;
import com.lec.spring.domain.User;
import com.lec.spring.service.UserService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class PrincipalDetails implements UserDetails {

    private UserService userService;

    public void setUserService(UserService userService) { this.userService = userService; }

    // --------------------------------

    private User user;

    public User getUser() {return user;}

    public PrincipalDetails(User user) {
        this.user = user;
    }

    // ---------------------------------


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();

        List<Authority> list = userService.selectAuthByUserKey(user.getUserKey());

        for (Authority authority : list) {
            collection.add(new GrantedAuthority() {
                @Override
                public String getAuthority() {
                    return authority.getAuth();
                }
            });
        }
        return collection;
    }

    @Override
    public String getPassword() {
        return user.getUserpass();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }
}
