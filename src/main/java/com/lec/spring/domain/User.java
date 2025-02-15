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

    private Long id;                // PK
    private String username;        // ID
    private String password;        // PW
    @ToString.Exclude
    private String passwordChk;     // PW checking
    private String name;            // Username
    private String phoneNM;         // Phone Number
    private String email;           // Email
    private LocalDateTime regDate;  // Register Date
    private Long sex;               // gender
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
