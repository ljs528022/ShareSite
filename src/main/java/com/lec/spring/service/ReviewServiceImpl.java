package com.lec.spring.service;

import com.lec.spring.DTO.ReviewDTO;
import com.lec.spring.domain.Review;
import com.lec.spring.repository.ReviewRepository;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    private ReviewRepository reviewRepository;

    @Autowired
    public ReviewServiceImpl(SqlSession sqlSession) {
        this.reviewRepository = sqlSession.getMapper(ReviewRepository.class);

        System.out.println("✅ ReviewService() Created");
    }

    @Override
    public int write(ReviewDTO reviewDTO) {
        Review review = Review.builder()
                .sellerKey(reviewDTO.getSellerKey())
                .buyerKey(reviewDTO.getBuyerKey())
                .reviewScore(reviewDTO.getReviewScore())
                .reviewDetail(reviewDTO.getReviewDetail())
                .writeDate(LocalDateTime.now())
                .build();

        return reviewRepository.write(review);
    }

    @Override
    public List<Review> findReviewsBySellerKey(String sellerKey) {
        List<Review> reviews = reviewRepository.findReviewsBySellerKey(sellerKey);

        if(reviews != null) {
            return reviews;
        } else {
            return null;
        }
    }
}
