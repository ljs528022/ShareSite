package com.lec.spring.repository;

import com.lec.spring.domain.Payment;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PaymentRepository {

    int savePayment(Payment payment);
}
