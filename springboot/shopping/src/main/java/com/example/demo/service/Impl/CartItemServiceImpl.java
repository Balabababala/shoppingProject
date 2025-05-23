package com.example.demo.service.Impl;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.dto.CartDto;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.CartItemService;



@Service
public class CartItemServiceImpl implements CartItemService{
	
	@Autowired
	CartItemRepository cartItemRepository;
	@Autowired
	ProductRepository productRepository; 
	
	@Override
	public List<CartDto> getCart(Long userId) {
	    return cartItemRepository.findByUserId(userId).stream()
	        .map(cartItem -> { 
	            return productRepository.findById(cartItem.getProductId())
	                .map(product -> new CartDto(product.getName(),product.getImageUrl(),product.getPrice(), cartItem.getQuantity()))
	                .orElseThrow(() -> new RuntimeException("找不到商品 ID: " + cartItem.getProductId()));
	        })
	        .toList(); // 如果是 Java 16+，可以用 toList()
	}
}
