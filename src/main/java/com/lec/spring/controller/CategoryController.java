package com.lec.spring.controller;

import com.lec.spring.domain.Category;
import com.lec.spring.repository.CategoryRepository;
import com.lec.spring.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5178/")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/api/category")
    public List<Category> findAllCategories() {
        return categoryService.findAll();
    }

}
