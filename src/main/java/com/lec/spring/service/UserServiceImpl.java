package com.lec.spring.service;

import com.lec.spring.domain.Authority;
import com.lec.spring.domain.User;
import com.lec.spring.repository.AuthorityRepository;
import com.lec.spring.repository.ReviewRepository;
import com.lec.spring.repository.UserRepository;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;
    private UserRepository userRepository;
    private AuthorityRepository authorityRepository;
    private ReviewRepository reviewRepository;


    @Autowired
    public UserServiceImpl(SqlSession sqlSession) {
        userRepository = sqlSession.getMapper(UserRepository.class);
        authorityRepository = sqlSession.getMapper(AuthorityRepository.class);
//        reviewRepository = sqlSession.getMapper(ReviewRepository.class);
        System.out.println(getClass().getName() + "() Created");
    }

    @Override
    public User findbyUserKey(Long userKey) {
        return userRepository.findByUserKey(userKey);
    }

    @Override
    public User findbyUserName(String username) {
        return userRepository.findByUserName(username);
    }

    @Override
    public int register(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.join(user);

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

        // userKey 와 authKey 지정
        user.setUserKey(userKey);
        Long authKey = authority.getAuthKey();

        authorityRepository.addAuth(userKey, authKey);

        return 1;
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
            //throw new IllegalAccessException("유효하지 않은 비밀번호 형식입니다.");
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
    public void updateTel(String newTel, Long userKey) {
        if (!isVaildTel(newTel)) {
            //throw new IllegalAccessException("유효하지 않은 핸드폰 번호 입니다.");
        }

        userRepository.updateTel(newTel, userKey);
    }

    private boolean isVaildTel(String tel) {
        String telRegex = "^010\\d{8}$";
        return  tel.matches(telRegex);
    }
}
