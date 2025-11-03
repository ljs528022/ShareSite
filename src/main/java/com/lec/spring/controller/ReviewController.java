package com.lec.spring.controller;

import com.lec.spring.DTO.ReviewDTO;
import com.lec.spring.domain.Review;
import com.lec.spring.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/review")
@CrossOrigin(origins = "http://localhost:5178")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/write")
    public ResponseEntity<?> writeReview(@RequestBody ReviewDTO reviewDTO) {
        reviewService.write(reviewDTO);

        return ResponseEntity.ok("저장 완료!");
    }

    @GetMapping("/{userKey}")
    public ResponseEntity<?> gerReviews(@PathVariable("userKey")String userKey) {
        List<Review> reviews = reviewService.findReviewsBySellerKey(userKey);

        return ResponseEntity.ok(reviews);
    }
}
