package com.lec.spring.service;

import com.lec.spring.DTO.LoginRequest;
import com.lec.spring.DTO.RegisterRequest;
import com.lec.spring.DTO.UserModifyRequest;
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
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;
//    private final ReviewRepository reviewRepository;
    private final JwtUtil jwtUtil;


    @Autowired
    public UserServiceImpl(
            PasswordEncoder passwordEncoder,
            SqlSession sqlSession,
            JwtUtil jwtUtil) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = sqlSession.getMapper(UserRepository.class);
        this.authorityRepository = sqlSession.getMapper(AuthorityRepository.class);
//        this.reviewRepository = sqlSession.getMapper(ReviewRepository.class);
        this.jwtUtil = jwtUtil;

        System.out.println("✅ UserService() Created");
    }

    @Override
    public User findByUserKey(String userKey) {
        return userRepository.findByUserKey(userKey);
    }

    @Override
    public Optional<User> findByUserName(String username) {
        return userRepository.findByUserName(username);
    }

    @Override
    public User findSellerInfoByUserKey(String userKey) {
        return userRepository.findSellerInfoByUserKey(userKey);
    }

    @Override
    public boolean isUsernameTaken(String username) {
        return userRepository.existsByUsername(username) > 0;
    }

    @Override
    public int register(RegisterRequest request) {
        Authority authority = authorityRepository.findByAuth("MEMBER");

        // Create User Serial Number
        String dataPrefix = LocalDateTime.now().format(DateTimeFormatter.BASIC_ISO_DATE);

        int year = Integer.parseInt(dataPrefix.substring(0, 4));
        int month = Integer.parseInt(dataPrefix.substring(4, 6));
        int day = Integer.parseInt((dataPrefix.substring(6, 8)));
        long result = year + month + day;

        dataPrefix = String.format("%-4s", Long.toHexString(result).toUpperCase()).replace(' ', '0');
        Long count = userRepository.countByUserKeyStartWith(dataPrefix);

        String serialNumber = String.format("%03d", count + 1);
        String userKey = dataPrefix + serialNumber;

        // User 에 새로운 유저 정보 저장
        User user = new User();
        user.setUserKey(userKey);
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());

        // 만약에 NICKNAME이 빈값이면 정해둔 이름을 넣는다.
        if(request.getUseralias() == null || request.getUseralias().trim().isEmpty()) {
            user.setUseralias("user" + userKey);
        } else {
            user.setUseralias(request.getUseralias());
        }

        user.setState("N");
        user.setUserimg("");
        user.setRegtype("S");
        user.setAuth(authority.getAuth());
        user.setRegDate(LocalDateTime.now());
        user.setEmailVerified(true);

        // User 등록
        userRepository.register(user);

        return 1;
    }

    @Override
    public String login(LoginRequest request) {
        User user = userRepository.findByUserName(request.getUsername())
                .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호가 일치하지 않습니다."));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
        userRepository.includeVisitCnt(user.getUserKey());

        return jwtUtil.generateToken(user.getUsername());
    }

    @Override
    public int modify(User user) {
        if(!user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        userRepository.update(user);

        return 1;
    }

    @Override
    public boolean verifyPass(String userKey, String password) {
        User user = userRepository.findByUserKey(userKey);

        if(!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다!");
        }

        return true;
    }

    @Override
    public List<Authority> selectAuthByUserKey(String userKey) {
        return null;
    }

    @Override
    public User getUserByUserName(String username) {
        return null;
    }

    @Override
    public User getUserByUserKey(String userKey) {
        return null;
    }

    @Override
    public void deleteAccount(String userKey) {
        User user = userRepository.findByUserKey(userKey);
        if (user != null) {
            user.setState("B");
            userRepository.deleteAccount(userKey);
        }
    }

    @Override
    public void updatePassword(String newPassword, String userKey) {
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
    public void updateEmail(String newEmail, String userKey) {
        userRepository.updateEmail(newEmail, userKey);
    }
}
