package com.lec.spring.controller;

import com.lec.spring.DTO.ReportDTO;
import com.lec.spring.domain.Report;
import com.lec.spring.domain.User;
import com.lec.spring.service.ReportService;
import com.lec.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5178")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private UserService userService;

    @PostMapping("/report/write")
    public ResponseEntity<?> writeReport(@RequestBody ReportDTO reportDTO) {
        reportService.writeReport(reportDTO);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/report")
    public ResponseEntity<?> getReports(@RequestParam(name = "keyword", required = true)String keyword) {
        List<Report> reports = reportService.getReports(keyword);

        return ResponseEntity.ok(reports);
    }

    @GetMapping("/report/users")
    public Map<String, Object> getUsersInfo(@RequestParam("reporter") String reporter, @RequestParam("target") String target) {
        User reporterInfo = userService.findByUserKey(reporter);
        User targetInfo = userService.findByUserKey(target);

        Map<String, Object> response = new HashMap<>();
        response.put("reporter", reporterInfo);
        response.put("target", targetInfo);

        return response;
    }


}
