package com.lec.spring.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserInfoResponse {
    private String userKey;
    private String username;
    private String useralias;
    private String email;
    private String state;
    private String userimg;
    private String auth;
}
