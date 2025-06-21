package com.example.demo.mapper;

import java.util.Comparator;
import java.util.List;

import com.example.demo.model.dto.ProductResponse;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.ProductImage;

public class ProductMapper {
	public static ProductResponse toDto(Product product) {
	    ProductResponse productResponse = new ProductResponse();

	    productResponse.setId(product.getId());
	    productResponse.setName(product.getName());
	    productResponse.setDescription(product.getDescription());
	    productResponse.setPrice(product.getPrice());
	    productResponse.setStock(product.getStock());

	    if (product.getCategory() != null) {
	        productResponse.setCategoryId(product.getCategory().getId());
	        productResponse.setCategoryName(product.getCategory().getName());
	    } else {
	        productResponse.setCategoryId(null);
	        productResponse.setCategoryName(null);
	    }

	    if (product.getSeller() != null) {
	        productResponse.setSellerUserDto(UserMapper.toDto(product.getSeller()));
	    }

	    productResponse.setIsDeleted(product.getIsDeleted());
	    productResponse.setStatus(product.getStatus());

	    if (product.getProductImages() != null) {
	        productResponse.setProductImageDtos(
	            product.getProductImages().stream()
	                .sorted(Comparator.comparing(ProductImage::getNumber))
	                .map(ProductImageMapper::toDto)
	                .toList()
	        );
	    } else {
	        productResponse.setProductImageDtos(List.of()); // 給空列表避免前端報錯
	    }

	    return productResponse;
	}
}
