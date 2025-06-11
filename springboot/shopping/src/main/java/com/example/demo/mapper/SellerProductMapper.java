package com.example.demo.mapper;

import com.example.demo.model.dto.SellerProductDto;
import com.example.demo.model.entity.Category;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.User;
//imageUrls 圖之後記得補



public class SellerProductMapper {
	
	public static Product toEntity(SellerProductDto sellerProductDto,Category category,User seller) {
		Product product = new Product ();
		product.setName(sellerProductDto.getName());
		product.setDescription(sellerProductDto.getDescription());
		product.setPrice(sellerProductDto.getPrice());
		product.setStock(sellerProductDto.getStock());
		product.setStatus(sellerProductDto.getStatus());
		product.setCategory(category);
		product.setSeller(seller);
		return product;
		
    }
	public static SellerProductDto toDto(Product product) {
	    SellerProductDto sellerProductDto = new SellerProductDto();
	    sellerProductDto.setName(product.getName());
	    sellerProductDto.setDescription(product.getDescription());
	    sellerProductDto.setPrice(product.getPrice());
	    sellerProductDto.setStock(product.getStock());
	    sellerProductDto.setStatus(product.getStatus());
	    sellerProductDto.setCategoryId(product.getCategory() != null ? product.getCategory().getId() : null);
	    
	    
	    return sellerProductDto;
	}
	
	
}