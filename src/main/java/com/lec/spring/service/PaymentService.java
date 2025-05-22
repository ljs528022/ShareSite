package com.lec.spring.service;


import com.lec.spring.domain.Payment;

import java.util.List;

public interface PaymentService {

    int savePayment(Payment payment);

    List<Payment> findByUserKey(String userKey);
}
