package com.lec.spring.controller;

import com.lec.spring.DTO.LikeDTO;
import com.lec.spring.domain.Like;
import com.lec.spring.service.ItemService;
import com.lec.spring.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5178")
public class LikeController {

    @Autowired
    private LikeService likeService;
    @Autowired
    private ItemService itemService;

    // 상품 찜 기능
    @PostMapping("/like")
    public ResponseEntity<?> addLike(@RequestBody LikeDTO likeDTO) {
        Like like = Like.builder()
                .userKey(likeDTO.getUserKey())
                .itemKey(likeDTO.getItemKey())
                .build();

        likeService.addLike(like);

        return ResponseEntity.ok(like);
    }

    @DeleteMapping("/like")
    public ResponseEntity<?> deleteLike(@RequestParam String userKey, @RequestParam Long itemKey) {
        likeService.deleteLike(userKey, itemKey);

        return ResponseEntity.ok("삭제 성공");
    }

    @GetMapping("/like")
    public ResponseEntity<?> findLike(@RequestParam String userKey, @RequestParam Long itemKey) {
        Like like = likeService.findLike(userKey, itemKey);

        return ResponseEntity.ok(like);
    }
}
