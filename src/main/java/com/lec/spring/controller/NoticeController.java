package com.lec.spring.controller;

import com.lec.spring.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5178/")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;


}
