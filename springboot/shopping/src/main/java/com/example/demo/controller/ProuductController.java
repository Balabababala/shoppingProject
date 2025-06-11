package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.ProductResponse;
import com.example.demo.model.dto.UserDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.ProductService;
import com.example.demo.service.RecentlyViewedService;

import jakarta.servlet.http.HttpSession;
import jakarta.websocket.server.PathParam;


//CategoryPage 用到 
@RestController
@RequestMapping("/api")
public class ProuductController {

	@Autowired
	private ProductService productService;
	
	@Autowired
	private RecentlyViewedService recentlyViewedService;
	
	//?category=xxx categoryPage 用
	@GetMapping		
	public ResponseEntity<ApiResponse<List<ProductResponse>>> findCategoryById(@RequestParam(defaultValue = "") String category){
		if(category.isEmpty()) {
			return ResponseEntity.ok(ApiResponse.success("獲取資料正確", productService.findAllProductsToProductResponse()));//空字串
		}
		
		return ResponseEntity.ok(ApiResponse.success("獲取資料正確", productService.findAllProductsByCategorySlugToProductResponses(category)));//對應值
	}
	
	//productPage 用
	@GetMapping("/products/{productId}")
	public ResponseEntity<ApiResponse<ProductResponse>> findById(HttpSession session,@PathVariable Long productId){
		UserDto userDto= (UserDto)session.getAttribute("userDto");
		if(userDto!= null) {
			recentlyViewedService.addRecentlyViewed(userDto.getUserId(), productId);
		}
		return ResponseEntity.ok(ApiResponse.success("獲取資料正確", productService.findProductByIdToProductResponse(productId)));
	}
	
	//searchPage 用
	@GetMapping("/products/search")
	public ResponseEntity<ApiResponse<List<ProductResponse>>> findBykeyWord(@RequestParam String keyword){
		return ResponseEntity.ok(ApiResponse.success("獲取資料正確", productService.findProductsByKeywordFullTextBooleanToProductResponses(keyword)));//對應值
	}
	
	
}
