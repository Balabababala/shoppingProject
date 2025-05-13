package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;



import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.entity.Category;
import com.example.demo.repository.CategoriesRowMap;
import com.example.demo.repository.CategoryRepository;


@RestController

public class CategoryForNavbar  {

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	
	@Autowired
	private CategoryRepository categoryRepository;
	
	@GetMapping("/categoriestomynavbar")
	public List<Category> getcatogory()   {
		
		
		Map<String, Object> map = new HashMap<>();
		
		CategoriesRowMap rowMapper =new CategoriesRowMap();
		
		List<Category> list=categoryRepository.findTopCategories();
		
	    return list;
	}
	
	
}
