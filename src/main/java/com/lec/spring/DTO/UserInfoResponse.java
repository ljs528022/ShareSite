package com.lec.spring.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserInfoResponse {
    private String userKey;
    private String username;
    private String useralias;
    private String email;
    private String auth;

    public UserInfoResponse(String userKey, String username, String useralias, String email, String auth) {
        this.userKey = userKey;
        this.username = username;
        this.useralias = useralias;
        this.email = email;
        this.auth = auth;
    }
}
