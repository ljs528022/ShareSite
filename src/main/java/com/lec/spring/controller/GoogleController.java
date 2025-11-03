package com.lec.spring.controller;

import com.lec.spring.util.JwtUtil;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class GoogleController {

    private final JwtUtil jwtUtil;

    public GoogleController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/temp-info")
    public Map<String, String> getTempInfo(@CookieValue("jwt")String token) {
        String email = jwtUtil.getUsernameFromToken(token);
        return Map.of("email", email);
    }

    @GetMapping("/check-login")
    public Map<String, String> checkGoogleLogin(@CookieValue("loginCookie")String token) {
        return Map.of("token", token);
    }

}
