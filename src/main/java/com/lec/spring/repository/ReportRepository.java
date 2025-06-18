package com.lec.spring.repository;

import com.lec.spring.domain.Report;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReportRepository {

    int writeReport(Report report);

    int countReportKeyLike(@Param("baseKey")String baseKey);

    List<Report> getReports(@Param("keyword")String keyword);
}
