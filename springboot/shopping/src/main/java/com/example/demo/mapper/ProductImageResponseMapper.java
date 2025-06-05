package com.example.demo.mapper;


import com.example.demo.model.dto.ProductImageResponse;

import com.example.demo.model.entity.ProductImage;

public class ProductImageResponseMapper {

	public static ProductImageResponse toDto(ProductImage productImage) {
        return new ProductImageResponse(productImage.getNumber(),productImage.getImageUrl());
    }
}
