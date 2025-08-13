package com.lec.spring.controller;

import com.lec.spring.domain.Notice;
import com.lec.spring.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@CrossOrigin(origins = "http://localhost:5178/")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    @GetMapping("/notice")
    public Map<String, Object> getAllNotice() {
        List<Notice> allNotices = noticeService.findAll();

        Map<String, Object> response = new HashMap<>();
        response.put("notices", allNotices);

        return response;
    }
}
