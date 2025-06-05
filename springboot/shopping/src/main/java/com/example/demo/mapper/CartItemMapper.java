package com.example.demo.mapper;

import com.example.demo.model.dto.CartItemResponse;
import com.example.demo.model.entity.CartItem;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.ProductImage;


public class CartItemMapper {
	public static CartItemResponse toDto(CartItem cartItem) {
		Product product = cartItem.getProduct();

        // 安全取得第一張圖片 URL
        String imageUrl = product.getProductImages().stream()
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElse(null); // 
		
        return new CartItemResponse(
        		cartItem.getProduct().getId(),
        		cartItem.getProduct().getName(),
        		imageUrl,
        		cartItem.getProduct().getPrice(),
                cartItem.getQuantity()
        );
    }
}
