package com.lec.spring.controller;

import com.lec.spring.service.KakaoLoginService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/oauth/kakao")
@RequiredArgsConstructor
public class KakaoController {

    @Autowired
    private KakaoLoginService kakaoLoginService;

    @GetMapping("/callback")
    public ResponseEntity<?> kakaoCallback(@RequestParam("code")String code) {
        return kakaoLoginService.handleCallback(code);
    }
}
