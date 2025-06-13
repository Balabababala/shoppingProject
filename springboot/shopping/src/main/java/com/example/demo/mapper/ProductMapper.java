package com.example.demo.mapper;

import com.example.demo.model.dto.ProductResponse;
import com.example.demo.model.entity.Product;

public class ProductMapper {
	public static ProductResponse toDto(Product product) {
		 ProductResponse productResponse =new ProductResponse();
		 productResponse.setId(product.getId());
		 productResponse.setName(product.getName());
		 productResponse.setDescription(product.getDescription());
		 productResponse.setPrice(product.getPrice());
		 productResponse.setCategoryId(product.getCategory().getId());
		 productResponse.setCategoryName(product.getCategory().getName());
		 productResponse.setSellerUserDto(UserMapper.toDto(product.getSeller()));
		 productResponse.setProductImageDto(product.getProductImages().stream()
				 													  .map(ProductImageMapper::toDto)
				 													  .toList()
		 );
        return productResponse;
    }
}
