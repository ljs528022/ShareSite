package com.lec.spring.controller;

import com.lec.spring.DTO.ItemDTO;
import com.lec.spring.DTO.LikeDTO;
import com.lec.spring.domain.Like;
import com.lec.spring.service.ItemService;
import com.lec.spring.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
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
    public ResponseEntity<?> deleteLike(@RequestParam("userKey")String userKey, @RequestParam("itemKey")Long itemKey) {
        likeService.deleteLike(userKey, itemKey);

        return ResponseEntity.ok("삭제 성공");
    }

    @GetMapping("/like")
    public ResponseEntity<?> findLike(@RequestParam("userKey") String userKey, @RequestParam("itemKey") Long itemKey) {
        Like like = likeService.findLike(userKey, itemKey);

        return ResponseEntity.ok(like);
    }

    @GetMapping("/like/{itemKey}")
    public ResponseEntity<?> countLike(@PathVariable("itemKey")Long itemKey) {
        int result = likeService.countLike(itemKey);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/likeItem/{userKey}")
    public ResponseEntity<?> getUserLikeItems(@PathVariable("userKey")String userKey) {
        Map<String, Object> responseBody = new HashMap<>();

        List<Like> likes = likeService.findByUserKey(userKey);
        List<Long> likesItemKey = likes.stream().map(Like::getItemKey).toList();

        List<ItemDTO> likedItems = itemService.findItemsByKeys(likesItemKey);

        responseBody.put("likedItems", likedItems);
        responseBody.put("count", likedItems.size());

        return ResponseEntity.ok(responseBody);
    }
}
