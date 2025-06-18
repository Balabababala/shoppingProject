package com.example.demo.controller.front;

import com.example.demo.model.dto.ProductResponse;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.front.RecommendProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommend/products")
public class RecommendProductController {

    @Autowired
    private RecommendProductService recommendProductService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getRecommendedProducts(
            @RequestParam(name = "userId", required = false) Long userId) {
        List<ProductResponse> products = recommendProductService.getRecommendedProducts(userId);
        return ResponseEntity.ok(ApiResponse.success("獲取推薦產品成功", products));
    }
}