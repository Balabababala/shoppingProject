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
	public List <CategoryDto> findCategoryBySlug(String slug){
		return categoryRepository.findBySlug(slug)
				.stream()
				.map(CategoryMapper::toDto)
				.toList();
	}
	
	@Override
	public List<CategoryDto> findSubcategories(String slug) {
	    Long parentId = categoryRepository.findBySlug(slug)
	            .orElseThrow(() -> new RuntimeException("找不到分類 " + slug))
	            .getId();

	    return buildCategoryTreeByParentId(parentId);
	}
	
	public List<CategoryDto> buildCategoryTree(String slug) {
	    Long parentId = categoryRepository.findBySlug(slug)
	            .orElseThrow(() -> new RuntimeException("找不到分類 " + slug))
	            .getId();

	    return buildCategoryTreeByParentId(parentId);
	}
	
	@Override
	public List<CategoryDto> buildCategoryTreeByParentId(Long parentId) {
	    List<Category> children = categoryRepository.findAll()
	        .stream()
	        .filter(c -> parentId.equals(c.getParentId()))
	        .toList();

	    return children.stream()
	        .map(c -> {
	            CategoryDto dto = CategoryMapper.toDto(c);
	            dto.setChildren(buildCategoryTreeByParentId(c.getId()));  // 記得改成 List<CategoryDto> children
	            return dto;
	        })
	        .toList();
	}


}
