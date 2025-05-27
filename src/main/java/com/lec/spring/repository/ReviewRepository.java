package com.lec.spring.repository;

import com.lec.spring.domain.Review;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReviewRepository {

    // Save Review
    int write(Review review);

    List<Review> findReviewsByBuyerKey(@Param("sellerKey")String sellerKey);
}
