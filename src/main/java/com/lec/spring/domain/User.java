package com.lec.spring.domain;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

    private Long userKey;           // PK
    private String username;        // ID
    private String password;        // PW
    @ToString.Exclude
    private String passwordChk;     // PW checking
    private String useralias;       // Username
    private String email;           // User Email
    private String regtype;         // Regist Type (site(S), naver(N), kakao(K))
    private String userimg;         // User Profile IMG
    private String state;           // User State (B : Banned, S : Stopped, N : Normal)
    private LocalDateTime regDate;  // Register Date
    private Long visitcnt;          // Visit Count
    private Long tradecnt;          // Trade Success Count

    // MEMBER Authority
    @ToString.Exclude
    private String authority;


    // User Page - Modify


    // User Page - Selling


    // For ADMIN


    // Logined User Info
    public static class CurrentUser {
        private String username;

        public CurrentUser(String username) {
            this.username = username;
        }
    }

}
