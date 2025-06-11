package com.example.demo.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.CategoryResponse;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.CategoryService;

//給 mynavbar 用的

@RestController
@RequestMapping("/api")
public class CategoryController  {
	
	@Autowired
	private CategoryService categoryService;
	
	@GetMapping("/categories/top-mynavbar")  //MyNavbarCategories用
	public ResponseEntity<ApiResponse<List<CategoryResponse>>> getTopCatogory()   {
		return ResponseEntity.ok(ApiResponse.success("最上層類別取得成功", categoryService.findTopCategory()));
	}
	
	@GetMapping("/categories/{slug}/tree")  			//CategoryPage 用
	public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCatogoryBySlug(@PathVariable String slug)   {
		return ResponseEntity.ok(ApiResponse.success("子類別取得成功", categoryService.findCategoryChildrenBySlugToCategoryResponse(slug)));
	}

}
