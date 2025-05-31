package com.example.demo.service;

import java.util.List;

import com.example.demo.model.dto.CategoryResponse;
import com.example.demo.model.entity.Category;



public interface CategoryService {
	List <CategoryResponse> findTopCategory();							//navbar 用的 只顯示最上層 分類
//	CategoryResponse findCategoryBySlug(String slug);					//用 slug 找  		   轉DTO
	List<CategoryResponse> findChildrenBySlug(String slug);				//用 slug 找 全部(含子分類) 轉DTO
	List<Category> findAllCategoryAndDescendantsBySlug(String slug);	//用 slug 找	全部 		但不轉DTO
}
