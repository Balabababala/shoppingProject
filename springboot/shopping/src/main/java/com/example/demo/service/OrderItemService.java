package com.example.demo.service;

import java.util.List;

import com.example.demo.model.entity.OrderItem;


public interface OrderItemService {
	void addOrderItem(List<OrderItem> orderItems);		//把orderItems丟到資料庫 建訂單用的
	List<OrderItem> CartItemToOrderItemByUserId(Long UserId);
}
