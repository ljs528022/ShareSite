package com.lec.spring.controller;

import com.lec.spring.DTO.LoginRequest;
import com.lec.spring.DTO.RegisterRequest;
import com.lec.spring.domain.User;
import com.lec.spring.service.EmailService;
import com.lec.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:5178/")
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        String email = request.getEmail();
        String username = request.getUsername();

        // 필수값 확인
        if(request.getUsername() == null || request.getPassword() == null || request.getEmail() == null) {
            return ResponseEntity.badRequest().body("필수 정보가 누락되었습니다.");
        }

        userService.register(request);
        return ResponseEntity.ok("회원가입 성공!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String token = userService.login(request);
        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }


}
