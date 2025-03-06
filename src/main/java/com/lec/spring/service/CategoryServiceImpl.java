package com.lec.spring.service;

import com.lec.spring.domain.Category;
import com.lec.spring.repository.CategoryRepository;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    public CategoryServiceImpl(SqlSession sqlSession) {
        categoryRepository = sqlSession.getMapper(CategoryRepository.class);
        System.out.println("CategoryService() Created");
    }

    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category findByName(String catename) {
        return categoryRepository.findByName(catename);
    }

    @Override
    public Category findByCateKey(Long cateKey) {
        return categoryRepository.findByCateKey(cateKey);
    }
}
