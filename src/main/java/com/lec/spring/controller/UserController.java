package com.lec.spring.controller;

import com.lec.spring.DTO.LoginRequest;
import com.lec.spring.DTO.LoginResponse;
import com.lec.spring.DTO.RegisterRequest;
import com.lec.spring.DTO.UserInfoResponse;
import com.lec.spring.domain.User;
import com.lec.spring.repository.UserRepository;
import com.lec.spring.service.EmailService;
import com.lec.spring.service.UserService;
import com.lec.spring.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5178")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private EmailService emailService;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        System.out.println(">>>> POST /user/register hit!");

        // 필수값 확인
        if(request.getUsername() == null || request.getPassword() == null || request.getEmail() == null) {
            return ResponseEntity.badRequest().body("필수 정보가 누락되었습니다.");
        }

        userService.register(request);

        try {
            return ResponseEntity.ok("회원가입 성공!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
        }
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        String token = userService.login(request);
        return new LoginResponse(token);
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> getCurrentUserInfo(@AuthenticationPrincipal UserDetails userDetails) {
        if(userDetails == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = userDetails.getUsername();
        User user = userService.findbyUserName(username)
                .orElseThrow(() -> new RuntimeException("유저 정보를 찾을 수 없습니다.."));

        UserInfoResponse response = new UserInfoResponse(
                user.getUserKey(),
                user.getUsername(),
                user.getUseralias(),
                user.getEmail(),
                user.getAuth()
        );

        return ResponseEntity.ok(response);
    }
}
