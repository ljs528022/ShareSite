package com.lec.spring.service;

import com.lec.spring.DTO.LoginRequest;
import com.lec.spring.DTO.RegisterRequest;
import com.lec.spring.domain.Authority;
import com.lec.spring.domain.User;
import com.lec.spring.repository.AuthorityRepository;
import com.lec.spring.repository.ReviewRepository;
import com.lec.spring.repository.UserRepository;
import com.lec.spring.util.JwtUtil;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;
    private UserRepository userRepository;
    private AuthorityRepository authorityRepository;
    private ReviewRepository reviewRepository;
    private JwtUtil jwtUtil;


    @Autowired
    public UserServiceImpl(SqlSession sqlSession) {
        userRepository = sqlSession.getMapper(UserRepository.class);
        authorityRepository = sqlSession.getMapper(AuthorityRepository.class);
//        reviewRepository = sqlSession.getMapper(ReviewRepository.class);
        System.out.println("UserService() Created");
    }

    @Override
    public User findbyUserKey(Long userKey) {
        return userRepository.findByUserKey(userKey);
    }

    @Override
    public Optional<User> findbyUserName(String username) {
        return userRepository.findByUserName(username);
    }

    @Override
    public int register(RegisterRequest request) {
        if(userRepository.findByUserName(request.getUsername()).isPresent()) {
            throw new RuntimeException("이미 존재하는 ID 입니다!");
        }

        Authority authority = authorityRepository.findByAuth("MEMBER");

        // Create User Serial Number
        String dataPrefix = LocalDateTime.now().format(DateTimeFormatter.BASIC_ISO_DATE);

        int year = Integer.parseInt(dataPrefix.substring(0, 4));
        int month = Integer.parseInt(dataPrefix.substring(4, 8));
        long result = year + month;

        dataPrefix = String.format("%-4X", Long.toHexString(result).toUpperCase());
        Long count = userRepository.countByUserKeyStartWith(dataPrefix);

        Long serialNumber = Long.parseLong(String.format("%03d", count + 1));
        Long userKey = Long.parseLong(dataPrefix + serialNumber);

        // User 에 새로운 유저 정보 저장
        User user = new User();
        user.setUserKey(userKey);
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setUseralias(request.getUseralias());
        user.setState("N");
        user.setUserimg("");
        user.setRegtype("S");
        user.setAuthority(authority.getAuth());
        user.setRegDate(LocalDateTime.now());
        // User 등록
        userRepository.join(user);

        return 1;
    }

    @Override
    public String login(LoginRequest request) {
        User user = userRepository.findByUserName(request.getUsername())
                .orElseThrow(() -> new RuntimeException("해당 ID를 찾을 수 없습니다.."));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Password가 일치하지 않습니다!");
        }

        return jwtUtil.generateToken(user.getUsername());
    }


    @Override
    public List<Authority> selectAuthByUserKey(Long userKey) {
        return null;
    }

    @Override
    public User getUserByUserName(String username) {
        return null;
    }

    @Override
    public User getUserByUserKey(Long userKey) {
        return null;
    }

    @Override
    public void deleteAccount(Long userKey) {
        User user = userRepository.findByUserKey(userKey);
        if (user != null) {
            user.setState("B");
            userRepository.deleteAccount(userKey);
        }
    }

    @Override
    public void updatePassword(String newPassword, Long userKey) {
        if (!isValidPassword(newPassword)) {
//            throw new IllegalAccessException("유효하지 않은 비밀번호 형식입니다.");
        }

        String hashedPassword = passwordEncoder.encode(newPassword);
        userRepository.updatePassword(hashedPassword, userKey);
    }

    private boolean isValidPassword(String password) {
        // 8 ~ 16자, 영문, 숫자, 대문자, 특문 포함
        String passwordRegex = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$";
        return password.matches(passwordRegex);
    }

    @Override
    public void updateEmail(String newEmail, Long userKey) {
        // 유효성 검사가...필요할까?

        userRepository.updateEmail(newEmail, userKey);
    }
}
