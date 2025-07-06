package com.example.demo.service.front.Impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.exception.ShoppingException;
import com.example.demo.mapper.*;
import com.example.demo.model.dto.CartItemResponse;
import com.example.demo.model.entity.CartItem;
import com.example.demo.model.entity.OrderItem;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.User;
import com.example.demo.model.enums.ProductStatus;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.front.CartItemService;
import com.example.demo.service.front.OrderItemService;

	
@Service
public class CartItemServiceImpl implements CartItemService{
		
	@Autowired
    private CartItemRepository cartItemRepository;
		
	@Autowired
	private ProductRepository productRepository;
	
	@Autowired
	private OrderItemService orderItemService;

	@Autowired
	private UserRepository userRepository;
	
	//邏輯
	@Override
	public void addOrUpdateCartItem(Long userId, Long productId, Integer quantity) {
	    // 驗證商品存在且有效
	    Product product = productRepository.findById(productId)
	        .filter(p -> !p.getIsDeleted() && p.getStatus() == ProductStatus.ACTIVE)
	        .orElse(null);
	    if (product == null) return;

	    // 取得使用者
	    User user = userRepository.findById(userId)
	        .orElseThrow(() -> new ShoppingException("找不到使用者"));

	    // 查詢是否已有該商品在購物車
	    Optional<CartItem> optionalItem = cartItemRepository.findByUserIdAndProductId(userId, productId)
	                                                         .stream().findFirst();

	    if (optionalItem.isPresent()) {
	        // 若已存在，更新數量
	        CartItem existingItem = optionalItem.get();
	        existingItem.setQuantity(existingItem.getQuantity() + quantity);
	        cartItemRepository.save(existingItem);
	    } else {
	        // 若不存在，新增一筆
	        CartItem newItem = new CartItem();
	        newItem.setUser(user);
	        newItem.setProduct(product);
	        newItem.setQuantity(quantity);
	        cartItemRepository.save(newItem);
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
