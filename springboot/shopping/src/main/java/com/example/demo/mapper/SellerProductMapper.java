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
	    sellerProductResponse.setName(product.getName());
	    sellerProductResponse.setDescription(product.getDescription());
	    sellerProductResponse.setPrice(product.getPrice());
	    sellerProductResponse.setStock(product.getStock());
	    sellerProductResponse.setStatus(product.getStatus());
	    sellerProductResponse.setCategoryId(product.getCategory() != null ? product.getCategory().getId() : null);

	    List<ProductImage> images = product.getProductImages();
	    if (images != null && !images.isEmpty()) {
	        // 主圖設第一張
	    	sellerProductResponse.setThumbnailUrl(images.get(0).getImageUrl());

	        // 其他圖片 URL（從第2張開始）
	        if (images.size() > 1) {
	            List<String> extraUrls = images.stream()
	                                           .skip(1)
	                                           .map(ProductImage::getImageUrl)
	                                           .toList();
	            sellerProductResponse.setExtraImagesUrl(extraUrls);
	        } else {
	        	sellerProductResponse.setExtraImagesUrl(List.of()); // 空清單
	        }
	    } else {
	    	sellerProductResponse.setThumbnailUrl(null);
	    	sellerProductResponse.setExtraImagesUrl(List.of());
	    }

	    return sellerProductResponse;
	}

	
	
}