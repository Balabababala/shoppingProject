package com.example.demo.service.front;

import java.util.List;

import com.example.demo.model.dto.CreateOrderDto;
import com.example.demo.model.dto.OrderResponse;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.Order;


public interface OrderService {
	
	//邏輯
	void createOrder(CreateOrderDto orderRequest,Long BuyerId);  		//建訂單用所有邏輯在這
	CreateOrderDto getUserDefaultToCreateOrderDto(UserDto userDto);     //取預設資料給OrderDto
	
	//買家用
	List<OrderResponse> getOrderByBuyerId(Long userId);				 	//看使用者(買方)訂單							
	
	boolean isOrderOwnedByUser(Long orderId, Long currentUserId);		//判斷該orderId 是否屬於買家
	
	//賣家
	List<OrderResponse> getOrderBySellerId(Long userId);			 	//看使用者(賣方)訂單
	void shipOrder(Long orderId, Long sellerId);						//
	String getOrderStatus(Long orderId);								//
	boolean isOrderOwnedBySeller(Long orderId, Long currentUserId);		//判斷該orderId 是否屬於賣加
	
	//共用
	void cancelOrder(Long orderId);										//取消訂單
}
