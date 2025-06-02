package com.example.demo.service;

import com.example.demo.model.dto.OrderRequest;
import com.example.demo.model.entity.Order;

public interface OrderService {
	//repository
	void save(Order order);

	//邏輯
	void createOrder(OrderRequest orderRequest,Long BuyerId);  //建訂單用所有邏輯在這
}
