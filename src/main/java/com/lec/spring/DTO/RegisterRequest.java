package com.lec.spring.DTO;

import lombok.Data;
@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String useralias;
    private String email;
}
