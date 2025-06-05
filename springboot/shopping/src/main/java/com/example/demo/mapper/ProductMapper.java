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
        	product.getCategory().getId(),
        	product.getCategory().getName(),
        	UserMapper.toDto(product.getSeller()),
        	product.getProductImages().stream().
        							   map(ProductImageResponseMapper::toDto).
        							   toList()
        );
    }
}
