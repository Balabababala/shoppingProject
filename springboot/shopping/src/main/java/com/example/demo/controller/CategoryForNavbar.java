package com.example.demo.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.entity.Category;
import com.example.demo.service.CategoryServiceImpl;


@RestController

public class CategoryForNavbar  {
	
	@Autowired
	private CategoryServiceImpl categoryServiceImpl;
	
	@GetMapping("/categoriestomynavbar")
	public List<Category> getcatogory()   {
	    return categoryServiceImpl.getTopCategory();
	}
	
	
}
