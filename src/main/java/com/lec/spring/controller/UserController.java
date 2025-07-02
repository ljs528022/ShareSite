package com.lec.spring.controller;

import com.lec.spring.DTO.*;
import com.lec.spring.domain.User;
import com.lec.spring.service.*;
import com.lec.spring.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5178")
public class UserController {

    @Autowired
    private FileUploadService fileUploadService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;
    @Autowired
    private ItemService itemService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private NaverLoginService naverLoginService;


    // 일반 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody RegisterRequest request) {

        // 필수값 확인
        if(request.getUsername() == null || request.getPassword() == null || request.getEmail() == null) {
            return ResponseEntity.badRequest().body("필수 정보가 누락되었습니다.");
        }

        userService.signup(request, "S");

        try {
            return ResponseEntity.ok("회원가입 성공!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
        }
    }

    // 다른 API 회원가입
    @PostMapping("/signup/social")
    public ResponseEntity<?> socialSignup(@RequestBody SocialRegisterRequest request) {
        userService.socialSignup(request, "N");
        return ResponseEntity.ok("네이버 회원가입 성공");
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        String token = userService.login(request);
        return new LoginResponse(token);
    }

    // 회원 탈퇴 처리
    @PostMapping("/withdraw/{userKey}")
    public ResponseEntity<?> withdrawUser(@PathVariable("userKey")String userKey) {
        User user = userService.findByUserKey(userKey);

        if (user == null || user.getUserKey() == null || user.getUserKey().isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            // 가입 방식이 네이버(N)인 경우에만 연결 해제 시도
            if ("N".equals(user.getRegtype()) && user.getAccessToken() != null) {
                naverLoginService.unlink(user.getAccessToken());
            }
        } catch (Exception e) {
            // unlink 실패 시 로그만 찍고 탈퇴는 계속 진행
            System.out.println("unlink 실패: {}" + e.getMessage());
        }

        // 상태값 변경 처리
        userService.withdrawUser(user.getUserKey());

        return ResponseEntity.ok().build();
    }

    // 회원 탈퇴 취소 처리
    @PostMapping("/cancel-withdraw")
    public ResponseEntity<?> cancelWithdraw(@RequestBody LoginRequest request) {
        User user = userService.findByUserName(request.getUsername());
        if(user.getUserKey() != null && !user.getUserKey().isEmpty()) {
            userService.cancelWithdraw(user.getUserKey());
            return ResponseEntity.ok().build();
        } else {
            return  ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/userprofile/{userKey}")
    public ResponseEntity<?> getUserInfo(@PathVariable("userKey")String userKey) {
        if(userKey != null && !userKey.isEmpty()) {
            // 해당 유저의 정보와 판매 상품들
            User userInfo = userService.findByUserKey(userKey);
            List<ItemDTO> items = itemService.findByUserKey(userKey);

            // 해당 유저의 신뢰도 계산
            double trustScore = userService.getTrustScore(userKey);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("userInfo", userInfo);
            responseBody.put("userItems", items);
            responseBody.put("trustScore", trustScore);

            return ResponseEntity.ok(responseBody);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/modify")
    public ResponseEntity<?> modifyUserInfo(
            @RequestPart("user") UserModifyRequest request,
            @RequestPart(value = "userimg", required = false) MultipartFile userimg) {

        try {
            String userImagePath = null;

            if(userimg != null && !userimg.isEmpty()) {
                userImagePath = fileUploadService.saveUserImage(userimg);
            }

            User existingUser = userService.findByUserKey(request.getUserKey());

            if(existingUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("해당 유저를 찾을 수 없습니다");
            }

            existingUser.setUserKey(request.getUserKey());
            existingUser.setUsername(request.getUsername());
            existingUser.setPassword(request.getPassword());
            existingUser.setUseralias(request.getUseralias());
            existingUser.setEmail(request.getEmail());
            existingUser.setUserIntro(request.getUserIntro());
            if(userImagePath != null) {
                existingUser.setUserimg(userImagePath);
            }

            userService.modify(existingUser);

            return  ResponseEntity.ok("수정 완료!");

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("이미지 저장 중 오류 발생: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("회원 정보 수성 중 오류 발생: " + e.getMessage());
        }
    }

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

    @GetMapping("/getSellerInfo/{userKey}")
    public ResponseEntity<?> getSellerInfo(@PathVariable("userKey") String userKey) {
        if(userKey != null && !userKey.isEmpty()) {
            User userInfo = userService.findByUserKey(userKey);

            return ResponseEntity.ok(userInfo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/getReviewUsers")
    public ResponseEntity<?> getReviewUsers(@RequestBody List<String> buyers) {
        if(buyers == null) return ResponseEntity.ok("리뷰 없음!");
        List<User> users = userService.getReviewUsers(buyers);

        return ResponseEntity.ok(users);
    }

}
