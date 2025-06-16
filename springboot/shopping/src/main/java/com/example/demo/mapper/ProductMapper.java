package com.example.demo.mapper;

import java.util.Comparator;

import com.example.demo.model.dto.ProductResponse;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.ProductImage;

public class ProductMapper {
	public static ProductResponse toDto(Product product) {
		 ProductResponse productResponse =new ProductResponse();
		 productResponse.setId(product.getId());
		 productResponse.setName(product.getName());
		 productResponse.setDescription(product.getDescription());
		 productResponse.setPrice(product.getPrice());
		 productResponse.setStock(product.getStock());
		 productResponse.setCategoryId(product.getCategory().getId());
		 productResponse.setCategoryName(product.getCategory().getName());
		 productResponse.setSellerUserDto(UserMapper.toDto(product.getSeller()));
		 productResponse.setIsDeleted(product.getIsDeleted());
		 productResponse.setStatus(product.getStatus());
		 if(product.getProductImages()==null)
		return productResponse; 
		productResponse.setProductImageDtos(
				    product.getProductImages().stream()
				        .sorted(Comparator.comparing(ProductImage::getNumber)) // 根據 number 排序
				        .map(ProductImageMapper::toDto)
				        .toList()
				);
        return productResponse;
    }
}
