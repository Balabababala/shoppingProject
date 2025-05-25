package com.example.demo.service;

import java.util.List;

import com.example.demo.model.dto.CategoryDto;



public interface CategoryService {
	List <CategoryDto> findTopCategory();
	CategoryDto findCategoryBySlug(String slug);

	List<CategoryDto> buildCategoryTreeBySlug(String slug);
}
