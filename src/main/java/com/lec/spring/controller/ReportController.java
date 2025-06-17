package com.lec.spring.controller;

import com.lec.spring.DTO.ReportDTO;
import com.lec.spring.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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


}
