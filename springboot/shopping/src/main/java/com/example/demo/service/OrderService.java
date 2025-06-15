package com.example.demo.service;

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
	void cancelOrder(Long orderId, Long buyerId);						//取消訂單
	//賣家
	List<OrderResponse> getOrderBySellerId(Long userId);			 	//看使用者(賣方)訂單
}
