package com.example.demo.service.front;

import com.example.demo.model.dto.ProductResponse;

import java.util.List;

public interface RecommendProductService {
    List<ProductResponse> getRecommendedProducts(Long userId);
}