package com.example.demo.controller.front;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.ProductResponse;
import com.example.demo.response.ApiResponse;
import com.example.demo.secure.CustomUserDetails;
import com.example.demo.service.front.RecommendProductService;

@RestController
@RequestMapping("/api/recommend/products")
public class RecommendProductController {

    @Autowired
    private RecommendProductService recommendProductService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getRecommendedProducts() {
        Long userId = null;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            userId = ((CustomUserDetails) auth.getPrincipal()).getUser().getId();
        }
        System.out.println("推薦產品 userId = " + userId);

        List<ProductResponse> products = recommendProductService.getRecommendedProducts(userId);
        System.out.println("推薦產品數量 = " + (products == null ? 0 : products.size()));
        return ResponseEntity.ok(ApiResponse.success("獲取推薦產品成功", products));
    }
}
