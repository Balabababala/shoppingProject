package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.ProductDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProuductController {

	@Autowired
	ProductService productService;
	
	@GetMapping		//&category?xxx categoryPage 用
	public ResponseEntity<ApiResponse<List<ProductDto>>> findByCategoryId(@RequestParam String category){
		return ResponseEntity.ok(ApiResponse.success("獲取資料正確", productService.findByCategorySlug(category)));
				
	}
}
