package com.example.demo.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.CategoryDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.CategoryService;

import jakarta.websocket.server.PathParam;



//給 mynavbar 用的

@RestController
@RequestMapping("/api/categories")
public class CategoryController  {
	
	@Autowired
	private CategoryService categoryService;
	
	@GetMapping("/top-mynavbar")  //MyNavbarCategories用
	public ResponseEntity<ApiResponse<List<CategoryDto>>> getTopCatogory()   {
		return ResponseEntity.ok(ApiResponse.success("最上層類別取得成功", categoryService.findTopCategory()));
	}
	
	@GetMapping("/{slug}/tree")  			//CategoryPage 用
	public ResponseEntity<ApiResponse<List<CategoryDto>>> getCatogoryByParentId(@PathVariable String slug)   {
		return ResponseEntity.ok(ApiResponse.success("子類別取得成功", categoryService.buildCategoryTreeBySlug(slug)));
	}

}
