package com.example.demo.service;

import com.example.demo.model.dto.OrderRequest;

public interface OrderService {
	void createOrder(OrderRequest orderRequest,Long BuyerId);  //建訂單用所有邏輯在這
}
