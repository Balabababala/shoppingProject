package com.example.demo.service;

import java.util.List;

import com.example.demo.model.dto.CategoryDto;
import com.example.demo.model.entity.Category;



public interface CategoryService {
	List <CategoryDto> findTopCategory();
	CategoryDto findCategoryBySlug(String slug);
	List<CategoryDto> findChildrenBySlug(String slug);
	List<Category> findAllCategoryAndDescendantsBySlug(String slug);
}
