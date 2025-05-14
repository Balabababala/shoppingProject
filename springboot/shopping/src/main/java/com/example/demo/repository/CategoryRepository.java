package com.example.demo.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Category;

@Repository
public interface CategoryRepository {
	
	 public List<Category> findAllCategories();
 
}
