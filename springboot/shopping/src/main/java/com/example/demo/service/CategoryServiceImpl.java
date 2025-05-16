package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.Category;
import com.example.demo.repository.CategoryRepository;

@Service
public class CategoryServiceImpl {
	@Autowired
	private CategoryRepository categoryRepository;
	
	public List<Category> getTopCategory(){
	    return categoryRepository.findAll()
	              .stream()
	              .filter(category -> category.getParentId() == null) // parentId是Long，可以直接比對null
	              .toList();
	}
	
}
