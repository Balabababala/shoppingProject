package com.example.demo.mapper;

import com.example.demo.model.dto.ProductResponse;
import com.example.demo.model.entity.Product;

public class ProductMapper {
	public static ProductResponse toDto(Product product) {
        return new ProductResponse(
        	product.getId(),
        	product.getName(),
        	product.getDescription(),
        	product.getPrice(),
        	product.getStock(),
        	product.getImageUrl(),
        	product.getCategory().getId(),
        	UserMapper.toDto(product.getSeller())
        );
    }
}
