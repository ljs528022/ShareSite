package com.lec.spring.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserModifyRequset {
    private String password;
    private String useralias;
    private String userImg;
    private String userIntro;
}
