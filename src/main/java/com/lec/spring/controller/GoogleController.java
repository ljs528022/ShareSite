package com.lec.spring.controller;

import com.lec.spring.service.GoogleLoginService;
import com.lec.spring.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class GoogleController {

    @Autowired
    private GoogleLoginService googleLoginService;

    @GetMapping("/loginSuccess")
    public ResponseEntity<?> getLoginInfo(@AuthenticationPrincipal OAuth2User user) {
        return null;
    }
}
