package com.lec.spring.DTO;

import lombok.Data;

@Data
public class SocialRegisterRequest {
    private String username;
    private String useralias;
    private String email;
    private String accessToken;
}
