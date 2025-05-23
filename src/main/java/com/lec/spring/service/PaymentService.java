package com.lec.spring.service;


import com.lec.spring.domain.Payment;

import java.util.List;

public interface PaymentService {

    int savePayment(Payment payment);
    int deletePayment(String orderKey);
    int updateConfirm(String orderKey);
    List<Payment> findByUserKey(String userKey);
    Payment findByOrderKey(String orderKey);
}
