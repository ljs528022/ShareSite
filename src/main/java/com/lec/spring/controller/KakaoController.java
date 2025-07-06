package com.lec.spring.controller;

import com.lec.spring.service.KakaoLoginService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/oauth/kakao")
@RequiredArgsConstructor
public class KakaoController {

    @Autowired
    private KakaoLoginService kakaoLoginService;
}
