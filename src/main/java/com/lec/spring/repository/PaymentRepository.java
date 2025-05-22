package com.lec.spring.repository;

import com.lec.spring.domain.Payment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PaymentRepository {

    int savePayment(Payment payment);

    List<Payment> findByUserKey(@Param("userKey")String userKey);
}
