package com.lec.spring.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserModifyRequest {
    private String userKey;
    private String username;
    private String password;
    private String useralias;
    private String email;
    private String userIntro;
}
