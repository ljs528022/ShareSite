package com.lec.spring.service;

import com.lec.spring.domain.EmailCode;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final Map<String, EmailCode> codeStorage = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> verifiedEmails = new ConcurrentHashMap<>();
    private final int CODE_EXPIRE_SECONDS = 60;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public String sendVerificationCode(String toEmail) {
        String code = generateRandomCode(6);
        LocalDateTime expireAt = LocalDateTime.now().plusSeconds(CODE_EXPIRE_SECONDS);

        EmailCode emailCode = new EmailCode(toEmail, code, expireAt);
        codeStorage.put(toEmail, emailCode);

        // 이메일 전송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("[회원가입] 이메일 인증 코드");
        message.setText("인증코드" + code + "\n30초 안에 입력해주세요.");
        mailSender.send(message);

        return code;
    }

    @Override
    public String generateRandomCode(int length) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for(int i = 0; i < length; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

    @Override
    public EmailCode getCodeInfo(String email) {
        return codeStorage.get(email);
    }

    @Override
    public boolean verifyCode(String email, String inputCode) {
        EmailCode stored = codeStorage.get(email);

        if(stored == null) {
            return false;  // 코드 요청이 없었거나, 삭제 됨
        }

        if(LocalDateTime.now().isAfter(stored.getExpirationTime())) {
            codeStorage.remove(email);
            return false;  // 유효 시간 초과
        }

        if(!stored.getCode().equals(inputCode)) {
            return false;  // 코드 불일치
        }

        // 성공한 경우 코드 제거
        codeStorage.remove(email);
        verifiedEmails.put(email, LocalDateTime.now()); // 인증 완료 시간 기록
        return true;
    }

    @Override
    public boolean isEmailVerified(String email) {
        LocalDateTime verifiedAt = verifiedEmails.get(email);
        if(verifiedAt == null) return false;
        return LocalDateTime.now().isBefore(verifiedAt.plusSeconds(CODE_EXPIRE_SECONDS));
    }

    @Override
    public void clearCode(String email) {
        codeStorage.remove(email);
    }
}
