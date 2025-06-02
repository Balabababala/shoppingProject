package com.example.demo.service;

import com.example.demo.model.dto.OrderDto;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.Order;

public interface OrderService {


	//邏輯
	void createOrder(OrderDto orderRequest,Long BuyerId);  //建訂單用所有邏輯在這
	
	OrderDto getUserDefaultToOrderDto(UserDto userDto);    //取預設資料給OrderDto
}
