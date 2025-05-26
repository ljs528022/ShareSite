package com.lec.spring.repository;

import com.lec.spring.domain.Payment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PaymentRepository {

    int savePayment(Payment payment);

    int deletePayment(@Param("orderKey")String orderKey);

    int updateConfirm(@Param("orderKey")String orderKey);

    List<Payment> findByUserKey(@Param("userKey")String userKey);

    Payment findByOrderKey(@Param("orderKey")String orderKey);

    int findByItemKeyAndUserKey(@Param("itemKey")Long itemKey, @Param("buyerKey")String buyerKey);
}
