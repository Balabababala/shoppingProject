package com.example.demo.mapper;

import com.example.demo.model.dto.ProductDto;
import com.example.demo.model.entity.Product;

public class ProductMapper {
	public static ProductDto toDto(Product product) {
        return new ProductDto(
        	product.getId(),
        	product.getName(),
        	product.getDescription(),
        	product.getPrice(),
        	product.getStock(),
        	product.getImageUrl(),
        	product.getCategoryId()
        );
    }
}
