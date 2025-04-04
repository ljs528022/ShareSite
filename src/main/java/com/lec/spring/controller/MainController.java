package com.lec.spring.controller;

import com.lec.spring.domain.Item;
import com.lec.spring.domain.User;
import com.lec.spring.repository.ItemRepository;
import com.lec.spring.service.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5178/")
public class MainController {

    @Autowired
    private ItemService itemService;

    @RequestMapping("/home")
    @CrossOrigin
    public String home(Model model, Authentication authentication) {
        // 로그인한 사용자 정보 추가
        addUserInfo(model, authentication);

        // 주간 인기 카테고리 상품
        List<Item> weeklyItems = itemService.getWeeklyMostItem();
        model.addAttribute("weeklyItems", weeklyItems);

        // 방금 등록된 상품
        List<Item> latestItems = itemService.getLatestItems();
        model.addAttribute("latestItems", latestItems);

        return "index";
    }



    private void addUserInfo(Model model, Authentication authentication) {
        if(authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            User.CurrentUser currentUser = new User.CurrentUser(username);
            model.addAttribute("currentUser", currentUser);
        }
    }

}
