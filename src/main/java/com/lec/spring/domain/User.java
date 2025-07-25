package com.lec.spring.domain;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

    private String userKey;             // PK
    private String username;            // ID
    private String password;            // PW
    private String useralias;           // Username
    private String email;               // User Email
    private String regtype;             // Regist Type (site(S), naver(N), kakao(K))
    private String userimg;             // User Profile IMG
    private String state;               // User State (S : 탈퇴 계정, R: 탈퇴 예정  N : 일반)
    private LocalDateTime regDate;      // Registed Date
    private Long visitcnt;              // Visit Count
    private Long tradecnt;              // Trade Success Count
    private boolean emailVerified;      // Email Verification
    private String userIntro;           // User Description
    private LocalDateTime editedDate;   // Edited Date

    @ToString.Exclude
    private String passwordChk;     // PW checking

    // MEMBER Authority
    @ToString.Exclude
    private String auth;

    // Logined User Info
    public static class CurrentUser {
        private String username;

        public CurrentUser(String username) {
            this.username = username;
        }
    }

}
