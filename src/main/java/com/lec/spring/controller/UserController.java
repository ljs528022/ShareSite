package com.lec.spring.controller;

import com.lec.spring.DTO.*;
import com.lec.spring.domain.User;
import com.lec.spring.service.EmailService;
import com.lec.spring.service.ItemService;
import com.lec.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5178")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private ItemService itemService;
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

    @GetMapping("/{userKey}")
    public ResponseEntity<?> getUserInfo(@PathVariable("userKey")String userKey) {
        if(userKey != null) {
            User userInfo = userService.findByUserKey(userKey);
            List<ItemDTO> items = itemService.findByUserKey(userKey);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("userInfo", userInfo);
            responseBody.put("userItems", items);

            return ResponseEntity.ok(responseBody);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

//    @PostMapping("/modify/{userKey}")
//    public ResponseEntity<?> modifyUserInfo(
//            @PathVariable("userKey")String userKey,
//            ) {
//        if(userKey != null) {
//            User userInfo = userService.modify(userKey);
//        }
//    }

    @PostMapping("/passChk")
    public ResponseEntity<?> verifyPassword(@RequestBody UserModifyRequest request) {
        String userKey = request.getUserKey();
        String password = request.getPassword();

        boolean verifiedPass = userService.verifyPass(userKey, password);

        if(!verifiedPass) {
            return ResponseEntity.badRequest().body("비밀번호가 일치하지 않습니다!");
        } else {
            return ResponseEntity.ok("비밀번호가 일치합니다!");
        }
    }


}
