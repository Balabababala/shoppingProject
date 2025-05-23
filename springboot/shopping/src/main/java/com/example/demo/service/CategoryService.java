package com.example.demo.service;

import java.util.List;

import com.example.demo.model.dto.CategoryDto;
import com.example.demo.model.entity.Category;


public interface CategoryService {
	List <CategoryDto> findTopCategory();
	List <CategoryDto> findCategoryBySlug(String slug);
	List <CategoryDto> findSubcategories(String slug);
	List<CategoryDto> buildCategoryTree(String slug);
	List<CategoryDto> buildCategoryTreeByParentId(Long parentId);
}
