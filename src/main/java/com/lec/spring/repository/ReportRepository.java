package com.lec.spring.repository;

import com.lec.spring.domain.Report;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ReportRepository {

    int writeReport(Report report);

    int countReportKeyLike(@Param("baseKey")String baseKey);
}
