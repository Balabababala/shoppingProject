package com.example.demo.service;

import java.util.List;

import com.example.demo.model.dto.CartDTO;



public interface CartItemService {
	List <CartDTO> getCart(Long userId);
}
