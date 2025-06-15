package com.example.demo.service.Impl;
	
	
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.example.demo.mapper.CartItemMapper;
import com.example.demo.model.dto.CartItemResponse;
import com.example.demo.model.entity.CartItem;
import com.example.demo.model.entity.OrderItem;
import com.example.demo.model.entity.Product;
import com.example.demo.model.enums.ProductStatus;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.CartItemService;
import com.example.demo.service.OrderItemService;


	
	
	
	
@Service
public class CartItemServiceImpl implements CartItemService{
		
	@Autowired
    private CartItemRepository cartItemRepository;
		
	@Autowired
	private ProductRepository productRepository;
	
	@Autowired
	private OrderItemService orderItemService;

	
	//邏輯
	@Override
	public void addOrUpdateCartItem(Long userId, Long productId, Integer quantity) {
		Optional <Product> opt =productRepository.findById(productId);
		if(opt.isEmpty()) {
			return ;
		}
		if(opt.get().getIsDeleted()==true || opt.get().getStatus()==ProductStatus.INACTIVE ) {
			return ;
		}
		
		if(cartItemRepository.findByUserIdAndProductId(userId, productId).isEmpty()) {
			cartItemRepository.addCartItem(userId, productId, quantity);
		} else {
			cartItemRepository.addCartItemIfExist(userId, productId, quantity);
	    }
	}
	
	@Override
	public void deleteItemFromCart(Long userId,Long productId) {
		cartItemRepository.deleteByUserIdAndProductId(userId, productId);
	};
	
	
	@Override
	public void clearCart(Long userId) {
		cartItemRepository.deleteByUserId(userId);
	}
	
	@Override
	public List<CartItemResponse> getCart(Long userId) {
		return cartItemRepository.findByUserIdWithProductAndProductImageItems(userId).stream()
										        				  .map(CartItemMapper::toDto)
										        				  .toList();  
		}
	
	
	

	

	@Override
	public Map<Long, List<OrderItem>> orderItemsGroupedBySeller(Long UserId) {
		Map<Long, List<OrderItem>> orderItemsGroup=new HashMap<>();
		List <CartItem> cartItems =cartItemRepository.findByUserIdWithProduct(UserId);
		
		for(CartItem cartItem:cartItems) {
				Long sellerId =cartItem.getProduct().getSeller().getId();
				
//			if(!orderItemsGroup.containsKey(sellerId)) {
//				orderItemsGroup.put(sellerId,new ArrayList<OrderItem>());
//			}
//			orderItemsGroup.get(sellerId).add(orderItemService.cartItemToOrderItem(cartItem));
				
			OrderItem orderItem=orderItemService.cartItemToOrderItem(cartItem);
			orderItemsGroup
		            .computeIfAbsent(sellerId, k -> new ArrayList<>())
		            .add(orderItem);
		}
		return orderItemsGroup;
	}  
}
