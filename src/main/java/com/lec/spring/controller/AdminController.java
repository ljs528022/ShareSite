package com.lec.spring.controller;

import com.lec.spring.DTO.ItemDTO;
import com.lec.spring.DTO.LoginRequest;
import com.lec.spring.DTO.UserModifyRequest;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.Report;
import com.lec.spring.domain.User;
import com.lec.spring.service.ItemService;
import com.lec.spring.service.ReportService;
import com.lec.spring.service.UserService;
import org.apache.ibatis.annotations.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5178/")
public class AdminController {

    @Autowired
    private UserService userService;
    @Autowired
    private ItemService itemService;
    @Autowired
    private ReportService reportService;

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequest request) {
        User user = userService.findByUserName(request.getUsername());

        if(!user.getAuth().equals("ADMIN")) {
            return ResponseEntity.badRequest().build();
        }

        String token = userService.login(request);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getStats() {
        List<User> users = userService.findAll();
        List<ItemDTO> items = itemService.findAllItem();
        List<Report> reports = reportService.findAll();

        Map<String, Object> response = new HashMap<>();
        response.put("users", users.size());
        response.put("items", items.size());
        response.put("reports", reports.size());
        response.put("latestItems", items.subList(0, Math.min(items.size(), 5)));
        response.put("latestReports", reports.subList(0, Math.min(reports.size(), 5)));

        return response;
    }

    // User 부분
    @GetMapping("/users")
    public Map<String, Object> getUsers() {
        List<User> allUsers = userService.findAll();

        Map<String, Object> response = new HashMap<>();
        response.put("data", allUsers);
        response.put("count", allUsers.size());

        return response;
    }

    @GetMapping("/users/{id}")
    public User getUser(@PathVariable("id")String id) {
        return userService.findByUserKey(id);
    }

    @PostMapping("/users/{id}")
    public User updateUser(@PathVariable("id")String id, @RequestBody User user) {
        User editingUser = userService.findByUserKey(id);

        if(editingUser == null) {
            return null;
        }


        return editingUser;
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable("id")String id) {

    }

    // Item 부분
    @GetMapping("/items")
    public Map<String, Object> getItems() {
        List<ItemDTO> items = itemService.findAllItem();

        Map<String, Object> response = new HashMap<>();
        response.put("data", items);
        response.put("count", items.size());

        return response;
    }

    @GetMapping("/items/{id}")
    public ItemDTO getItem(@PathVariable("id")Long id) {
        return itemService.findByItemKey(id);
    }

    @PostMapping("/items/{id}")
    public ItemDTO updateItem(@PathVariable("id")String id, @RequestBody ItemDTO itemDTO) {

        
    }


}
