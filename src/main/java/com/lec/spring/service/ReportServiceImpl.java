package com.lec.spring.service;

import com.lec.spring.DTO.ReportDTO;
import com.lec.spring.domain.Report;
import com.lec.spring.domain.User;
import com.lec.spring.repository.ReportRepository;
import com.lec.spring.repository.UserRepository;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;

    @Autowired
    public ReportServiceImpl(SqlSession sqlSession) {
        this.reportRepository = sqlSession.getMapper(ReportRepository.class);

        System.out.println("✅ ReportService() Created");
    }

    @Override
    public int writeReport(ReportDTO reportDTO) {
        String reportKey = generateReportKey(reportDTO.getReporterKey());

        Report report = new Report();
        report.setReportKey(reportKey);
        report.setReporterKey(reportDTO.getReporterKey());
        report.setTargetKey(reportDTO.getTargetKey());
        report.setReason(reportDTO.getReason());
        report.setContent(reportDTO.getContent());
        report.setCreatedAt(LocalDateTime.now());

        return reportRepository.writeReport(report);
    }

    @Override
    public List<Report> getReports(String keyword) {
        return reportRepository.getReports(keyword);
    }

    public String generateReportKey(String reporterKey) {
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String baseKey = reporterKey + "-" + dateStr;

        int count = reportRepository.countReportKeyLike(baseKey);

        if(count == 0) {
            return baseKey;
        } else {
            String suffix = String.format("-%02d", count);
            return baseKey + suffix;
        }
    }
}
