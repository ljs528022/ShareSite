package com.lec.spring.controller;

import com.lec.spring.DTO.ReportDTO;
import com.lec.spring.domain.Report;
import com.lec.spring.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5178")
public class ReportController {

    @Autowired
    private ReportService reportService;

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


}
