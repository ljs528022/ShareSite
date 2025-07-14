package com.lec.spring.controller;

import com.lec.spring.DTO.LoginRequest;
import com.lec.spring.DTO.UserModifyRequest;
import com.lec.spring.domain.User;
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
        
    }

    @GetMapping
    public Map<String, Object> getUsers() {
        List<User> allUsers = userService.findAll();

        Map<String, Object> response = new HashMap<>();
        response.put("allUsers", allUsers);
        response.put("userCount", allUsers.size());

        return response;
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable("userKey")String userKey) {
        return userService.findByUserKey(userKey);
    }

    @PutMapping
    public User updateUser(@PathVariable("userKey")String userKey, @RequestBody User user) {
        User editingUser = userService.findByUserKey(userKey);



        return editingUser;
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable("userKey")String userKey) {

    }

}
