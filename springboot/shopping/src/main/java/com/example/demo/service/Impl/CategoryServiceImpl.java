package com.example.demo.service.Impl;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
	public List<CategoryDto> findChildrenBySlug(String slug) {
		return categoryRepository.findChildrenBySlug(slug).stream()
															.map(categoty->CategoryMapper.toDto(categoty))
															.toList();
	}
	

		
		
}
