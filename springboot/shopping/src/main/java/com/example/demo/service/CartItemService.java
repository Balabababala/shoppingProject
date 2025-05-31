package com.example.demo.service;

import java.util.List;

import com.example.demo.model.dto.CartItemResponse;



public interface CartItemService {
	List <CartItemResponse> getCart(Long userId);					//顯示購物車資料用的
	void addCartItem(Long userId,Long ProductId,Integer quantity);	//新增購物車物品 用的
	void deleteAllCartItemByUser(Long userId);						//清空購物車
}
