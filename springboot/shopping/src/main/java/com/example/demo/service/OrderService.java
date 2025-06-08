package com.example.demo.service;

import java.util.List;

import com.example.demo.model.dto.CreateOrderRequest;
import com.example.demo.model.dto.OrderResponse;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.Order;

public interface OrderService {
	//repository
	void save(Order order);

	List<Order> findByBuyerIdWithOrderItemAndBuyerAndSeller(Long userId);
	//邏輯
	void createOrder(CreateOrderRequest orderRequest,Long BuyerId);  //建訂單用所有邏輯在這
	
	CreateOrderRequest getUserDefaultToOrderDto(UserDto userDto);    //取預設資料給OrderDto
	
	List<OrderResponse> getOrderByBuyerId(Long userId);				 //看使用者(買方)訂單
}
