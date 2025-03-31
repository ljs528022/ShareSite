package com.lec.spring;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.lec.spring.repository")
public class ShareSiteApplication {
	public static void main(String[] args) { SpringApplication.run(ShareSiteApplication.class, args); }
}
