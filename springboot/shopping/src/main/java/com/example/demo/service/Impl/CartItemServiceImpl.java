	package com.example.demo.service.Impl;
	
	
	import java.util.List;
	
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.stereotype.Service;

import com.example.demo.mapper.CartItemMapper;
import com.example.demo.model.dto.CartItemResponse;
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
		public List<CartItemResponse> getCart(Long userId) {
		    return cartItemRepository.findByUserId(userId).stream()
		        .map(CartItemMapper::toDto)
		        .toList(); // 如果是 Java 16+，可以用 toList()  
		}
	
		@Override
		public void addCartItem(Long userId, Long ProductId, Integer quantity) {
			if(cartItemRepository.findByUserIdAndProductId(userId, ProductId).isEmpty()) {
				cartItemRepository.addCartItem(userId, ProductId, quantity);
			}
			cartItemRepository.addCartItemIfExist(userId, ProductId, quantity);
		}

		@Override
		public void deleteAllCartItemByUser(Long userId) {
			cartItemRepository.deleteByUserId(userId);
		} 
	}
