package com.lec.spring.controller;

import com.lec.spring.DTO.LoginRequest;
import com.lec.spring.domain.User;
import com.lec.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin")
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
}
