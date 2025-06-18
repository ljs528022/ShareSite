package com.lec.spring.service;

import com.lec.spring.DTO.ReportDTO;
import com.lec.spring.domain.Report;

import java.util.List;

public interface ReportService {

    int writeReport(ReportDTO reportDTO);

    List<Report> getReports(String keyword);
}
