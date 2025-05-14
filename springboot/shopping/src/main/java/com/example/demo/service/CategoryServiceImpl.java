package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.Category;
import com.example.demo.repository.CategoryRepositoryImpl;

@Service
public class CategoryServiceImpl {
	@Autowired
	private CategoryRepositoryImpl categoryRepositoryImpl;
	
	public List <Category> getTopCategory(){
		return	categoryRepositoryImpl.findAllCategories()
									  .stream()
									  .filter((category)->category
											  .getParentId()==null)
									  .toList();
	};
	
}
