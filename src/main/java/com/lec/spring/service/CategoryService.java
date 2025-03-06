package com.lec.spring.service;

import com.lec.spring.domain.Category;

import java.util.List;

public interface CategoryService {

    // Get All Categories
    List<Category> findAll();

    // Search By Name
    Category findByName(String catename);

    // Search By CategoryKey
    Category findByCateKey(Long cateKey);


}
