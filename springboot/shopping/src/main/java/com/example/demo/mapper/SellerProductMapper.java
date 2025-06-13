package com.example.demo.mapper;

import java.util.List;

import com.example.demo.model.dto.SellerProductCreateRequest;
import com.example.demo.model.dto.SellerProductResponse;
import com.example.demo.model.entity.Category;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.ProductImage;
import com.example.demo.model.entity.User;
//imageUrls 圖之後記得補



public class SellerProductMapper {
	
	public static Product toEntity(SellerProductCreateRequest sellerProductCreateRequest,Category category,User seller) {
		Product product = new Product ();
		product.setName(sellerProductCreateRequest.getName());
		product.setDescription(sellerProductCreateRequest.getDescription());
		product.setPrice(sellerProductCreateRequest.getPrice());
		product.setStock(sellerProductCreateRequest.getStock());
		product.setStatus(sellerProductCreateRequest.getStatus());
		product.setCategory(category);
		product.setSeller(seller);
		return product;
    }
	
	public static SellerProductResponse toDto(Product product) {
	    SellerProductResponse sellerProductResponse = new SellerProductResponse();
	    sellerProductResponse.setId(product.getId());
	    sellerProductResponse.setName(product.getName());
	    sellerProductResponse.setDescription(product.getDescription());
	    sellerProductResponse.setPrice(product.getPrice());
	    sellerProductResponse.setStock(product.getStock());
	    sellerProductResponse.setStatus(product.getStatus());
	    sellerProductResponse.setCategoryId(product.getCategory().getId());
	    sellerProductResponse.setProductImageDto(product.getProductImages().stream()
				  .map(ProductImageMapper::toDto)
				  .toList()
	    );
	    return sellerProductResponse;
	}

	
	
}