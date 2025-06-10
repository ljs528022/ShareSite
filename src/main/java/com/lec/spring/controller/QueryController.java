package com.lec.spring.controller;

import com.lec.spring.DTO.ItemDTO;
import com.lec.spring.service.ItemService;
import com.lec.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5178")
public class QueryController {

    @Autowired
    private ItemService itemService;
    @Autowired
    private UserService userService;

    @GetMapping("/search")
    public ResponseEntity<?> searchItems(
            @RequestParam(name = "category", required = false) Long cateKey,
            @RequestParam(name = "min", required = false) Long min,
            @RequestParam(name = "max", required = false) Long max,
            @RequestParam(name = "keyword", required = false) String keyword
    ) {
        // 헤더에서 입력한 검색 값이 있다면 받와서 검색
        if(keyword != null && !keyword.trim().isEmpty()) {
            List<ItemDTO> items = itemService.searchItemsByKeyword(keyword);

            return ResponseEntity.ok(items);
        } else {
            // 검색 페이지에서 카테고리와 가격대로 검색
            Long rangeStart = null;
            Long rangeEnd = null;

            if (cateKey != null) {
                if(cateKey % 100 == 0) {
                    rangeStart = cateKey;
                    rangeEnd = cateKey + 100;
                } else {
                    rangeStart = cateKey;
                    rangeEnd = cateKey + 1;
                }
            }

            List<ItemDTO> items = itemService.searchItems(rangeStart, rangeEnd, min, max);

            return ResponseEntity.ok(items);
        }
    }

    @GetMapping("/search/price")
    public ResponseEntity<?> searchPrice (@RequestParam(name = "keyword")String keyword) {
        if(keyword != null && !keyword.trim().isEmpty()) {

        }

        return ResponseEntity.ok("");
    }
}
