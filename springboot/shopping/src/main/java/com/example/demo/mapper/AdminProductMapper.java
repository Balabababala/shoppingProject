package com.example.demo.mapper;

import com.example.demo.model.dto.AdminProductCreateRequest;
import com.example.demo.model.dto.AdminProductResponse;
import com.example.demo.model.dto.SellerProductCreateRequest;
import com.example.demo.model.dto.SellerProductResponse;
import com.example.demo.model.entity.Category;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.User;

public class AdminProductMapper {

	public static Product toEntity(AdminProductCreateRequest adminProductCreateRequest,Category category,User seller) {
		Product product = new Product ();
		product.setName(adminProductCreateRequest.getName());
		product.setDescription(adminProductCreateRequest.getDescription());
		product.setPrice(adminProductCreateRequest.getPrice());
		product.setStock(adminProductCreateRequest.getStock());
		product.setStatus(adminProductCreateRequest.getStatus());
		product.setCategory(category);
		product.setSeller(seller);
		return product;
    }
	
	public static AdminProductResponse toDto(Product product) {
		AdminProductResponse adminProductResponse = new AdminProductResponse();
		adminProductResponse.setId(product.getId());
		adminProductResponse.setName(product.getName());
		adminProductResponse.setDescription(product.getDescription());
		adminProductResponse.setPrice(product.getPrice());
		adminProductResponse.setStock(product.getStock());
		adminProductResponse.setStatus(product.getStatus());
		adminProductResponse.setCategoryId(product.getCategory().getId());
		adminProductResponse.setProductImageDtos(product.getProductImages().stream()
																			.map(ProductImageMapper::toDto)
																			.toList()
	    );
	    return adminProductResponse;
	}
}
