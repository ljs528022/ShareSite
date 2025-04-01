package com.lec.spring.controller;

import com.lec.spring.domain.User;
import com.lec.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/login")
    public void login(Model model){}

    @GetMapping("/regist")
    public void register(){}

//    @PostMapping("/regist")
//    @ResponseBody
//    public ResponseEntity<Boolean> confirmUser(User user) {
//        if(user.getUsername() == null || user.getUsername().trim().isEmpty()) {
//            return new ResponseEntity<>(false, HttpStatus.OK);
//        }
//
//    }
}
