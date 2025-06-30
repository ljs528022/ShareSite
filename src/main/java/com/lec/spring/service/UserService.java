package com.lec.spring.service;

import com.lec.spring.DTO.LoginRequest;
import com.lec.spring.DTO.RegisterRequest;
import com.lec.spring.DTO.UserModifyRequest;
import com.lec.spring.domain.Authority;
import com.lec.spring.domain.User;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.Optional;

public interface UserService {

    // Search by UserKey
    User findByUserKey (String userKey);
    // Search by User ID
    User findByUserName (String username);

    List<User> findUsersByUserKeys(List<String> userKeys);

    User findSellerInfoByUserKey(String userKey);

    // 아이디 중복 확인
    boolean isUsernameTaken(String username);

    // 회원가입
    int signup (RegisterRequest request, String regType);

    // 로그인
    String login(LoginRequest request);

    int modify(User user);

    // 비밀번호 확인
    boolean verifyPass(String userKey, String password);

    // 유저의 거래 리뷰 불러오기
    List<User> getReviewUsers(List<String> buyerKeys);

    // 유저의 신뢰도 점수 불러오기
    double getTrustScore(String userKey);

    // 유저 탈퇴 처리
    void withdrawUser(String userKey);

    // 유저 탈퇴 처리 취소
    void cancelWithdraw(String userKey);

    // 7일이 지난 탈퇴 예정 회원 탈퇴 전환
     void withdrawOver7Days();

    // -- Admin Page --

}
