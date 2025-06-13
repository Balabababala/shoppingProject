package com.example.demo.mapper;

import com.example.demo.model.dto.ProductImageDto;
import com.example.demo.model.entity.ProductImage;

public class ProductImageMapper {
	public static ProductImageDto toDto(ProductImage productImage) {
		ProductImageDto productImageDto =new ProductImageDto();
		productImageDto.setId(productImage.getId());
		productImageDto.setImageUrl(productImage.getImageUrl());
		productImageDto.setNumber(productImage.getNumber());
		productImageDto.setProductId(productImage.getId());
		return productImageDto;
   }
}
