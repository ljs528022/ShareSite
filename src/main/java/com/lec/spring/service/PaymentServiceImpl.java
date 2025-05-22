package com.lec.spring.service;

import com.lec.spring.DTO.PaymentRequest;
import com.lec.spring.domain.Payment;
import com.lec.spring.repository.AuthorityRepository;
import com.lec.spring.repository.PaymentRepository;
import com.lec.spring.repository.UserRepository;
import com.lec.spring.util.JwtUtil;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    @Autowired
    public PaymentServiceImpl(SqlSession sqlSession) {
        this.paymentRepository = sqlSession.getMapper(PaymentRepository.class);

        System.out.println("✅ PaymentService() Created");
    }

    @Override
    public int savePayment(Payment payment) {

        return paymentRepository.savePayment(payment);
    }

    @Override
    public List<Payment> findByUserKey(String userKey) {
        return paymentRepository.findByUserKey(userKey);
    }
}
