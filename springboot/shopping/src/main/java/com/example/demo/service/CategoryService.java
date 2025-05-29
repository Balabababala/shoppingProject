package com.example.demo.service;

import java.util.List;

import com.example.demo.model.dto.CategoryResponse;
import com.example.demo.model.entity.Category;



public interface CategoryService {
	List <CategoryResponse> findTopCategory();
	CategoryResponse findCategoryBySlug(String slug);
	List<CategoryResponse> findChildrenBySlug(String slug);
	List<Category> findAllCategoryAndDescendantsBySlug(String slug);
}
