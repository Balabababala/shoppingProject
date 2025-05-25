package com.example.demo.service.Impl;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.util.*;
import com.example.demo.mapper.*;
import com.example.demo.model.dto.CategoryDto;
import com.example.demo.model.entity.Category;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.service.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService{
	@Autowired
	private CategoryRepository categoryRepository;
	
	
	@Override
	public List<CategoryDto> findTopCategory(){
	    return categoryRepository.findAll()
	              .stream()
	              .filter(category -> category.getParentId() == null) // parentId是Long，可以直接比對null
	              .map(CategoryMapper::toDto)
	              .toList();
	}
	@Override
	public CategoryDto findCategoryBySlug(String slug){
		Category category = categoryRepository.findBySlug(slug)
		        .orElseThrow(() -> new RuntimeException("找不到分類 " + slug));
		return CategoryMapper.toDto(category);
	}
	
	@Override
	public List<CategoryDto> buildCategoryTreeBySlug(String slug) {
		// 1. 建立 ID 對應的 CategoryDto Map
		Map<Long,CategoryDto> categoryDtos  = CategoryTreeUtil.buildCategoryMap(categoryRepository.findAll());
		
		// 2. 建立樹狀結構
		for(CategoryDto categoryDto: categoryDtos.values()) {
			Long pid = categoryDto.getParentId();
			if (pid != null && categoryDtos.containsKey(pid)) {
				categoryDtos.get(pid).getChildren().add(categoryDto); // 把自己加到父節點的 children
	        }
		}
		
		 // 3. 回傳指定 slug 下的子樹根節點（例如首頁點開的某大分類）
	    return findCategoryBySlug(slug).getChildren();
	}
		
		
}
