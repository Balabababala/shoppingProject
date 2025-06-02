package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.dto.CartItemResponse;
import com.example.demo.model.entity.CartItem;
import com.example.demo.model.entity.OrderItem;


public interface CartItemService {
	//repository
	
	void deleteByUserId(Long userId);
	
	List<CartItem> findByUserId(Long userId);
	
	List<CartItem> findByUserIdWithProduct(Long userId);
	
	List<CartItem> findByUserIdAndProductId(Long userId,Long productId );

	void addCartItem(Long userId,Long productId ,Integer quantity);

	void addCartItemIfExist(Long userId,Long productId , Integer quantity);

	
	//邏輯
	List <CartItemResponse> getCart(Long userId);						//顯示購物車資料用的
	void deleteAllCartItemByUser(Long userId);							//清空購物車
	Map<Long , List <OrderItem>> orderItemsGroupedBySeller(Long userId);// 把userId 的 orderItems分賣家  用userId而不是直接傳入orderItems的原因 防 N+1
}					
