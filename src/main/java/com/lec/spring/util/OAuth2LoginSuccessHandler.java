package com.lec.spring.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lec.spring.domain.User;
import com.lec.spring.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public OAuth2LoginSuccessHandler(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        User user = userRepository.findByEmail(email);

        if(user == null) {
            // 회원가입을 해야한다면, 그걸 위한 임시 token 생성
            String token = jwtUtil.generateToken(email);

            Cookie signupCookie = new Cookie("jwt", token);
            signupCookie.setHttpOnly(false);
            signupCookie.setPath("/");
            signupCookie.setMaxAge(10 * 60);   // 10분만 유지
            response.addCookie(signupCookie);

            response.sendRedirect("http://localhost:5178/user/signup/social");
        } else {
            String token = jwtUtil.generateToken(user.getUsername());

            Cookie loginCookie = new Cookie("loginCookie", token);
            loginCookie.setHttpOnly(true);
            loginCookie.setPath("/");
            loginCookie.setMaxAge(10 * 60);
            response.addCookie(loginCookie);

            response.sendRedirect("http://localhost:5178/oauth/login-success");
        }

    }
}
