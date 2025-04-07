package com.lec.spring.controller;

import com.lec.spring.domain.Category;
import com.lec.spring.repository.CategoryRepository;
import com.lec.spring.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5178/")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/api/category")
    @CrossOrigin(origins = "http://localhost:5178/")
    public List<Category> findAllCategories() {
        return categoryRepository.findAll();
    }
}
