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
    public ResponseEntity<List<ItemDTO>> searchItems(
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) Long min,
            @RequestParam(required = false) Long max
    ) {
        List<ItemDTO> items = itemService.searchItems(category, min, max);

        return ResponseEntity.ok(items);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ItemDTO>> searchItemsByKeyword(@RequestParam(required = false)String keyword) {

        List<ItemDTO> items = itemService.searchItemsByKeyword(keyword);

        return ResponseEntity.ok(items);
    }
}
