package com.lec.spring.controller;

import com.lec.spring.util.JwtUtil;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class GoogleController {

    private final JwtUtil jwtUtil;

    public GoogleController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/me")
    public Map<String, Object> getUserInfo(@AuthenticationPrincipal OAuth2User oAuth2User) {
        if(oAuth2User == null) {
            return Map.of("error", "not_authenticated");
        }

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        String token = jwtUtil.generateToken(name);

        return Map.of(
                "email", email,
                "name", name,
                "token", token
        );
    }
}
