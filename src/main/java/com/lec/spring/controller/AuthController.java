package com.lec.spring.controller;

import com.lec.spring.DTO.UserInfoResponse;
import com.lec.spring.domain.User;
import com.lec.spring.service.EmailService;
import com.lec.spring.service.UserService;
import com.lec.spring.util.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5178/")
public class AuthController {

    @Autowired
    private EmailService emailService;
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // ID Verification
    @PostMapping("/usernameChk")
    public ResponseEntity<?> checkUsername(@RequestBody Map<String, String> body) {
        String username = body.get("username");

        boolean isTaken = userService.isUsernameTaken(username);

        Map<String, Boolean> response = new HashMap<>();
        response.put("isTaken", isTaken);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/send-code")
    public ResponseEntity<?> sendCode(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        if(email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("이메일을 입력하세요!");
        }

        String code = emailService.sendVerificationCode(email);
        Map<String, String> res = new HashMap<>();
        res.put("code", code);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code = body.get("code");

        if (email == null || code == null) {
            return ResponseEntity.badRequest().body("이메일과 인증코드를 모두 입력해주세요.");
        }

        boolean result = emailService.verifyCode(email, code);

        if (result) {
            return ResponseEntity.ok("인증 성공");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패 또는 시간이 초과되었습니다.");
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<UserInfoResponse> getCurrentUserInfo(@AuthenticationPrincipal UserDetails userDetails) {
        if(userDetails == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = userDetails.getUsername();
        User user = userService.findByUserName(username)
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