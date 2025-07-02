package com.lec.spring.service;

import com.lec.spring.DTO.LoginRequest;
import com.lec.spring.DTO.RegisterRequest;
import com.lec.spring.DTO.SocialRegisterRequest;
import com.lec.spring.domain.Authority;
import com.lec.spring.domain.User;
import com.lec.spring.repository.AuthorityRepository;
import com.lec.spring.repository.ReportRepository;
import com.lec.spring.repository.ReviewRepository;
import com.lec.spring.repository.UserRepository;
import com.lec.spring.util.JwtUtil;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
    private final ReviewRepository reviewRepository;
    private final ReportRepository reportRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserServiceImpl(
            PasswordEncoder passwordEncoder,
            SqlSession sqlSession,
            JwtUtil jwtUtil) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = sqlSession.getMapper(UserRepository.class);
        this.authorityRepository = sqlSession.getMapper(AuthorityRepository.class);
        this.reviewRepository = sqlSession.getMapper(ReviewRepository.class);
        this.reportRepository = sqlSession.getMapper(ReportRepository.class);
        this.jwtUtil = jwtUtil;

        System.out.println("✅ UserService() Created");
    }

    @Override
    public User findByUserKey(String userKey) {
        return userRepository.findByUserKey(userKey);
    }

    @Override
    public User findByUserName(String username) {
        return userRepository.findByUserName(username);
    }

    @Override
    public List<User> findUsersByUserKeys(List<String> userKeys) {
        return userRepository.findUsersByUserKeys(userKeys);
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
    public int signup(RegisterRequest request, String regType) {
        Authority authority = authorityRepository.findByAuth("MEMBER");

        // Create User Serial Number
        String userKey = generateUserKey();

        // User 에 새로운 유저 정보 저장
        User user = new User();
        user.setUserKey(userKey);
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUseralias(request.getUseralias());
        user.setEmail(request.getEmail());
        user.setUserimg("");
        user.setRegtype(regType);
        user.setState("N");
        user.setRegDate(LocalDateTime.now());
        user.setAuth(authority.getAuth());
        user.setEmailVerified(true);

        // User 등록
        userRepository.signup(user);

        return 1;
    }

    @Override
    public int socialSignup(SocialRegisterRequest request, String regType) {
        Authority authority = authorityRepository.findByAuth("MEMBER");

        String userKey = generateUserKey();

        User user = new User();
        user.setUserKey(userKey);
        user.setUsername(request.getUsername());
        user.setUseralias(request.getUseralias());
        user.setEmail(request.getEmail());
        user.setUserimg("");
        user.setRegtype(regType);
        user.setState("N");
        user.setRegDate(LocalDateTime.now());
        user.setAuth(authority.getAuth());
        user.setEmailVerified(true);
        user.setAccessToken(request.getAccessToken());

        // User 등록
        userRepository.socialSignup(user);

        return 1;
    }

    @Override
    public String login(LoginRequest request) {
        User user = userRepository.findByUserName(request.getUsername());

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
        userRepository.includeVisitCnt(user.getUsername());

        return jwtUtil.generateToken(user.getUsername());
    }

    @Override
    public int modify(User user) {
        if(!user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        user.setEditedDate(LocalDateTime.now());
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
    public List<User> getReviewUsers(List<String> buyerKeys) {
        return userRepository.getReviewUsers(buyerKeys);
    }

    // 신뢰도 계산
    @Override
    public double getTrustScore(String userKey) {
        // 기본 점수 탈퇴했으면 0, 가입되어 있으면 20
        if(userKey != null) {
            String state = userRepository.findByUserKey(userKey).getState();
            int baseScore = "N".equalsIgnoreCase(state) ? 20 : 0;

            // 리뷰 점수 최대 60점
            int goodReviews = reviewRepository.findGoodReviews(userKey);  // 긍정적 리뷰 수
            int badReviews = reviewRepository.findBadReviews(userKey);    // 부정적 리뷰 수
            int totalReviews = goodReviews + badReviews;

            double reviewScore;
            if (totalReviews == 0) {
                reviewScore = 0;
            } else {
                double ratio = (double) goodReviews / totalReviews;
                reviewScore = ratio * 60;
            }

            // 신고 내역 점수
            int maxPenalty = 30;
            int reportCount = reportRepository.countReportKeyLike(userKey);
            int reportPenalty = Math.min(reportCount * 5, maxPenalty);

            // 신뢰도 점수 계산 => 기본 점수 + 리뷰 점수 - 신고 패널티
            double trustScore = baseScore + reviewScore - reportPenalty;
            trustScore = Math.max(trustScore, 0);

            return trustScore;
        } else {
            return 0;
        }
    }

    @Override
    public void withdrawUser(String userKey) {
        userRepository.changeUserState(userKey, "R", LocalDateTime.now());
    }

    @Override
    public void cancelWithdraw(String userKey) {
        userRepository.changeUserState(userKey, "N", LocalDateTime.now());
    }

    @Override
    @Scheduled(cron = "0 0 4 * * *") // 매일 오전 4시 실행
    public void withdrawOver7Days() {
        userRepository.withdrawOver7Days();
        System.out.println("[스케줄러] 7일이 경과한 탈퇴 예정 회원 상태 전환");
    }

    private boolean isValidPassword(String password) {
        // 8 ~ 16자, 영문, 숫자, 대문자, 특문 포함
        String passwordRegex = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$";
        return password.matches(passwordRegex);
    }

    private String generateUserKey() {
        String dataPrefix = LocalDateTime.now().format(DateTimeFormatter.BASIC_ISO_DATE);

        int year = Integer.parseInt(dataPrefix.substring(0, 4));
        int month = Integer.parseInt(dataPrefix.substring(4, 6));
        int day = Integer.parseInt((dataPrefix.substring(6, 8)));
        long result = year + month + day;

        dataPrefix = String.format("%-4s", Long.toHexString(result).toUpperCase()).replace(' ', '0');
        Long count = userRepository.countByUserKeyStartWith(dataPrefix);

        String serialNumber = String.format("%03d", count + 1);
        String userKey = dataPrefix + serialNumber;

        return userKey;
    }
}
