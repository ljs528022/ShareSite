package com.lec.spring.controller;

import com.lec.spring.DTO.ReviewDTO;
import com.lec.spring.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/review")
@CrossOrigin(origins = "http://localhost:5178")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/write")
    public ResponseEntity<?> writeReview(@RequestBody ReviewDTO reviewDTO) {
        reviewService.write(reviewDTO);

        return ResponseEntity.ok("저장 완료!");
    }

    @GetMapping("/{buyerKey}")
    public ResponseEntity<?> getReviews(@PathVariable("buyerKey")String buyerKey) {


        return ResponseEntity.ok("");
    }
}
