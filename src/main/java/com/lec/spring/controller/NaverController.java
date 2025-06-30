package com.lec.spring.controller;

import com.lec.spring.service.NaverLoginService;
import lombok.RequiredArgsConstructor;
import org.aspectj.apache.bcel.generic.RET;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/oauth/naver")
@RequiredArgsConstructor
public class NaverController {

    @Autowired
    private NaverLoginService naverLoginService;

    @GetMapping("/callback")
    public ResponseEntity<?> naverCallback(@RequestParam("code")String code, @RequestParam("state")String state) {
        return naverLoginService.handleCallback(code, state);
    }
}
