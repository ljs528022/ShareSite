package com.lec.spring.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserModifyRequest {
    private String userKey;
    private String password;
    private String useralias;
    private String userImg;
    private String userIntro;
}
