package com.lec.spring.domain;

import lombok.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

    private Long userKey;                // PK
    private String username;        // ID
    private String userpass;        // PW
    @ToString.Exclude
    private String userpassChk;     // PW checking
    private String useralias;            // Username
    private String tel;         // Phone Number
    private String regtype;           // Regist Type (site(S), naver(N), kakao(K))
    private String userimg;         // User Profile IMG
    private String state;           // User State (B : Banned, S : Stopped, N : Normal)
    private LocalDateTime regDate;  // Register Date
    private Long visitcnt;          // Visit Count
    private Long tradecnt;          // Trade Success Count

    // MEMBER Authority
    @Builder.Default
    @ToString.Exclude
    private List<Authority> authorities = new ArrayList<>();


    // User Page - Modify


    // User Page - Selling


    // For ADMIN


}
