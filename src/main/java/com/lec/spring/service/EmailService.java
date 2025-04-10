package com.lec.spring.service;

import com.lec.spring.domain.EmailCode;
import org.springframework.mail.javamail.JavaMailSender;

public interface EmailService {

    String sendVerificationCode(String toEmail);

    String generateRandomCode(int length);

    boolean verifyCode(String email, String inputCode);

    EmailCode getCodeInfo(String email);

    boolean isEmailVerified(String email);

    void clearCode(String email);
}
