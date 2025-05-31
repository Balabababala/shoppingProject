package com.example.demo.service.Impl;



import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.mapper.*;
import com.example.demo.model.dto.CategoryResponse;
import com.example.demo.model.entity.Category;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.service.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService{
	@Autowired
	private CategoryRepository categoryRepository;
	
	
	@Override
	public List<CategoryResponse> findTopCategory(){
	    return categoryRepository.findAll()
	              .stream()
	              .filter(category -> category.getParentId() == null) // parentId是Long，可以直接比對null
	              .map(CategoryMapper::toDto)
	              .toList();
	}
	
//	@Override
//	public CategoryResponse findCategoryBySlug(String slug){
//		Category category = categoryRepository.findBySlug(slug)
//		        .orElseThrow(() -> new RuntimeException("找不到分類 " + slug));
//		return CategoryMapper.toDto(category);
//	}
	
	
	@Override
	public List<CategoryResponse> findChildrenBySlug(String slug) {
		return categoryRepository.findChildrenBySlug(slug).stream()
															.map(categoty->CategoryMapper.toDto(categoty))
															.toList();
	}
	
	@Override
	public List<Category> findAllCategoryAndDescendantsBySlug(String slug) {
        Optional<Category> rootOpt = categoryRepository.findBySlug(slug);
        if (rootOpt.isEmpty()) {
            return List.of();
        }
        Category root = rootOpt.get();
        List<Category> result = new ArrayList<>();
        result.add(root);
        fetchChildrenRecursively(root, result);
        return result;
    }

    private void fetchChildrenRecursively(Category parent, List<Category> accumulator) {
        List<Category> children = categoryRepository.findByParentId(parent.getId());
        if (children.isEmpty()) return;
        accumulator.addAll(children);
        for (Category child : children) {
            fetchChildrenRecursively(child, accumulator);
        }
    }
	

		
}
