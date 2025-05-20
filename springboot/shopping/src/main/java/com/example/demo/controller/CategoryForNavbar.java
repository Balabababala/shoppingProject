package com.example.demo.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.entity.Category;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.CategoryService;



@RestController

public class CategoryForNavbar  {
	
	@Autowired
	private CategoryService categoryService;
	
	@GetMapping("/categoriestopmynavbar")  //可能需要改成最多取五個 可能要做 是否null的判斷    要改到service 
	public ResponseEntity<ApiResponse<List<Category>>> getcatogory()   {
		return ResponseEntity.ok(ApiResponse.success("最上層類別取得成功", categoryService.getTopCategory()));
	}
	
	
}
