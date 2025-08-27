package com.lec.spring.service;

import com.lec.spring.repository.UserRepository;
import com.lec.spring.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GoogleLoginService {
    private UserRepository userRepository;
    private JwtUtil jwtUtil;

    @Autowired
    public GoogleLoginService(SqlSession sqlSession, JwtUtil jwtUtil) {
        this.userRepository = sqlSession.getMapper(UserRepository.class);
        this.jwtUtil = jwtUtil;
    }

    @Value("")
    private String clientId;
    @Value("")
    private String clientSecret;

    public ResponseEntity<?> handleCallBack()

}
