package com.lec.spring.repository;

import com.lec.spring.domain.Review;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReviewRepository {

    // Save Review
    int write(Review review);

    List<Review> findReviewsBySellerKey(@Param("sellerKey")String sellerKey);

    int findGoodReviews(@Param("sellerKey")String sellerKey);

    int findBadReviews(@Param("sellerKey")String sellerKey);
}
