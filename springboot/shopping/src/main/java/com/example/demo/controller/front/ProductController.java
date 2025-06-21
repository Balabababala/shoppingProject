package com.example.demo.controller.front;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import com.example.demo.model.dto.ProductResponse;
import com.example.demo.response.ApiResponse;
import com.example.demo.secure.CustomUserDetails;
import com.example.demo.service.front.CartItemService;
import com.example.demo.service.front.ProductService;
import com.example.demo.service.front.RecentlyViewedService;




//CategoryPage 用到 
@RestController
@RequestMapping("/api/products")
public class ProductController {

	@Autowired
	private ProductService productService;
	
	@Autowired
    private CartItemService cartItemService;

    private CustomUserDetails getCurrentUserDetails() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
	
	//?category=xxx categoryPage 用
	@GetMapping		
	public ResponseEntity<ApiResponse<List<ProductResponse>>> findCategoryById(@RequestParam(defaultValue = "") String category){
		
		if(category.isEmpty()) {
			return ResponseEntity.ok(ApiResponse.success("獲取資料正確", productService.findAllProductsToProductResponse()));//空字串
		}
		
		return ResponseEntity.ok(ApiResponse.success("獲取資料正確", productService.findAllProductsByCategorySlugToProductResponses(category)));//對應值
	}
	
	//productPage 用
	@GetMapping("/{productId}")
	public ResponseEntity<ApiResponse<ProductResponse>> findById(@PathVariable Long productId){
		
		return ResponseEntity.ok(ApiResponse.success("獲取資料正確", productService.findProductByIdToProductResponse(productId)));
	}
	
	//searchPage 用
	@GetMapping("/search")
	public ResponseEntity<ApiResponse<List<ProductResponse>>> findBykeyWord(@RequestParam String keyword) {
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    Long userId = null;

	    if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	        userId = userDetails.getUser().getId();
	    }

	    List<ProductResponse> results = productService.findProductsByKeywordFullTextBooleanToProductResponses(userId, keyword);
	    return ResponseEntity.ok(ApiResponse.success("獲取資料正確", results));
	}

	
}
