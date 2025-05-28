package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.ProductDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.ProductService;

import jakarta.websocket.server.PathParam;


//CategoryPage 用到 
@RestController
@RequestMapping("/api/products")
public class ProuductController {

	@Autowired
	ProductService productService;
	
	
	//?category=xxx categoryPage 用
	@GetMapping		
	public ResponseEntity<ApiResponse<List<ProductDto>>> findCategoryById(@RequestParam(defaultValue = "") String category){
		if(category.isEmpty()) {
			return ResponseEntity.ok(ApiResponse.success("獲取資料正確", productService.findAll()));//空字串
		}
		
		return ResponseEntity.ok(ApiResponse.success("獲取資料正確", productService.findAllCategoryBySlug(category)));//對應值
	}
	
	//productPage 用
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<ProductDto>> findById(@PathVariable Long id){
		return ResponseEntity.ok(ApiResponse.success("獲取資料正確", productService.findById(id)));
	}
	
	//searchPage 用
	@GetMapping("/search")
	public ResponseEntity<ApiResponse<List<ProductDto>>> findBykeyWord(@RequestParam String keyword){
		return ResponseEntity.ok(ApiResponse.success("獲取資料正確", productService.findByKeywordFullTextBoolean(keyword)));//對應值
	}
	
	
}
