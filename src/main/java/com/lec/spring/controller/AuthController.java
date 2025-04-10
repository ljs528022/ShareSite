package com.lec.spring.controller;

import com.lec.spring.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5178/")
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private EmailService emailService;

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
}
