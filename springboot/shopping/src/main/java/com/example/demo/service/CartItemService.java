package com.example.demo.service;

import java.util.List;

import com.example.demo.model.dto.CartItemResponse;



public interface CartItemService {
	List <CartItemResponse> getCart(Long userId);
	void addCartItem(Long userId,Long ProductId,Integer quantity);
}
