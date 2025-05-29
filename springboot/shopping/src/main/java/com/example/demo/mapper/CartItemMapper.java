package com.example.demo.mapper;

import com.example.demo.model.dto.CartItemResponse;
import com.example.demo.model.entity.CartItem;


public class CartItemMapper {
	public static CartItemResponse toDto(CartItem cartItem) {
        return new CartItemResponse(
        		cartItem.getProduct().getId(),
        		cartItem.getProduct().getName(),
        		cartItem.getProduct().getImageUrl(),
        		cartItem.getProduct().getPrice(),
                cartItem.getQuantity()
        );
    }
}
