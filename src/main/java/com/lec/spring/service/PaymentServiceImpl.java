package com.lec.spring.service;

import com.lec.spring.DTO.PaymentRequest;
import com.lec.spring.domain.Payment;
import com.lec.spring.repository.*;
import com.lec.spring.util.JwtUtil;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    @Autowired
    public PaymentServiceImpl(SqlSession sqlSession) {
        this.paymentRepository = sqlSession.getMapper(PaymentRepository.class);
        this.itemRepository = sqlSession.getMapper(ItemRepository.class);
        this.userRepository = sqlSession.getMapper(UserRepository.class);

        System.out.println("✅ PaymentService() Created");
    }

    @Override
    public int savePayment(Payment payment) {
        return paymentRepository.savePayment(payment);
    }

    @Override
    public int deletePayment(String orderKey) {
        return paymentRepository.deletePayment(orderKey);
    }

    @Override
    public int updateConfirm(String orderKey) {
        paymentRepository.updateConfirm(orderKey);

        Long itemKey = paymentRepository.findByOrderKey(orderKey).getItemKey();
        String userKey = paymentRepository.findByOrderKey(orderKey).getSellerKey();
        itemRepository.chTradeState(itemKey);
        userRepository.includeTradeCnt(userKey);

        return 1;
    }

    @Override
    public List<Payment> findByUserKey(String userKey) {
        return paymentRepository.findByUserKey(userKey);
    }

    @Override
    public Payment findByOrderKey(String orderKey) {
        return paymentRepository.findByOrderKey(orderKey);
    }

    @Override
    public Boolean findByItemKeyAndUserKey(Long itemKey, String buyerKey) {
        return paymentRepository.findByItemKeyAndUserKey(itemKey, buyerKey) > 0;
    }
}
