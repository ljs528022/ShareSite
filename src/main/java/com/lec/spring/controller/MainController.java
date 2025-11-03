package com.lec.spring.controller;

import com.lec.spring.DTO.ItemDTO;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.User;
import com.lec.spring.repository.ItemRepository;
import com.lec.spring.service.CategoryService;
import com.lec.spring.service.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class MainController {

    @Autowired
    private ItemService itemService;

    @Autowired
    private CategoryService categoryService;

    @RequestMapping("/home")
    @CrossOrigin(origins = "http://localhost:5178", allowCredentials = "true")
    public Map<String, Object> home(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();

        // 주간 인기 카테고리 상품
        List<ItemDTO> weeklyItems = itemService.getWeeklyItems(20);
        response.put("weeklyItems", weeklyItems);

        // 방금 등록된 상품
        List<ItemDTO> latestItems = itemService.getLatestItems(20);
        response.put("latestItems", latestItems);

        return response;
    }

    private void addUserInfo(Model model, Authentication authentication) {
        if(authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            User.CurrentUser currentUser = new User.CurrentUser(username);
            model.addAttribute("currentUser", currentUser);
        }
    }

}
