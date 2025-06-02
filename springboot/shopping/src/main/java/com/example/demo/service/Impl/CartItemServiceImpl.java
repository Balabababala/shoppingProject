package com.example.demo.service.Impl;
	
	
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.mapper.CartItemMapper;
import com.example.demo.model.dto.CartItemResponse;
import com.example.demo.model.entity.CartItem;
import com.example.demo.model.entity.OrderItem;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.service.CartItemService;
import com.example.demo.service.OrderItemService;
	
	
	
	
@Service
public class CartItemServiceImpl implements CartItemService{
		
	@Autowired
    private CartItemRepository cartItemRepository;
		
		
	@Autowired
	private OrderItemService orderItemService;

	//repository	
	
	@Override
	public void deleteByUserId(Long userId) {
		cartItemRepository.deleteByUserId(userId);
	}

	@Override
	public List<CartItem> findByUserId(Long userId) {
		return cartItemRepository.findByUserId(userId);
	}

	@Override
	
	public List<CartItem> findByUserIdWithProduct(Long userId){
		return cartItemRepository.findByUserIdWithProduct(userId);
	}
	@Override
	public List<CartItem> findByUserIdAndProductId(Long userId, Long productId) {
		return cartItemRepository.findByUserIdAndProductId(userId,productId);
	}
	
	@Override
	public void addCartItem(Long userId,Long productId ,Integer quantity) {
		cartItemRepository.addCartItem(userId, productId, quantity);
	};

	@Override
	public void addCartItemIfExist(Long userId, Long productId, Integer quantity) {
		cartItemRepository.addCartItemIfExist(userId, productId, quantity);
	}

	
	//邏輯
	@Override
	public List<CartItemResponse> getCart(Long userId) {
		return findByUserId(userId).stream()
		        				   .map(CartItemMapper::toDto)
		        				   .toList(); // 如果是 Java 16+，可以用 toList()  
		}
	
	@Override
	public void addOrUpdateCartItem(Long userId, Long productId, Integer quantity) {
		if(findByUserIdAndProductId(userId, productId).isEmpty()) {
			addCartItem(userId, productId, quantity);
		} else {
	        addCartItemIfExist(userId, productId, quantity);
	    }
	}

	@Override
	public void deleteAllCartItemByUser(Long userId) {
		deleteByUserId(userId);
	}

	@Override
	public Map<Long, List<OrderItem>> orderItemsGroupedBySeller(Long UserId) {
		Map<Long, List<OrderItem>> orderItemsGroup=new HashMap<>();
		List <CartItem> cartItems =findByUserIdWithProduct(UserId);
		
		for(CartItem cartItem:cartItems) {
				Long sellerId =cartItem.getProduct().getSellerId();
				
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
