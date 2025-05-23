package com.example.demo.service;

import java.util.List;

import com.example.demo.model.dto.CartDto;



public interface CartItemService {
	List <CartDto> getCart(Long userId);
}
