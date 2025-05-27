package com.lec.spring.service;

import com.lec.spring.DTO.ReviewDTO;
import com.lec.spring.domain.Review;

import java.util.List;

public interface ReviewService {

    int write(ReviewDTO reviewDTO);

    List<Review> findReviewsByBuyerKey(String buyerKey);
}
