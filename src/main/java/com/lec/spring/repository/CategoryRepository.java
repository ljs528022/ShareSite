package com.lec.spring.repository;

import com.lec.spring.domain.Category;

import java.util.List;

public interface CategoryRepository {

    // Get All Categories
    List<Category> findAll();

    // Search by Name
    Category findByName(String catename);

    // Search by CategoryKey
    Category findByCateKey(Long cateKey);
}
