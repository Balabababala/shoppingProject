package com.example.demo.service;

import java.util.List;
import java.util.Map;

import com.example.demo.model.entity.CartItem;
import com.example.demo.model.entity.Order;
import com.example.demo.model.entity.OrderItem;


public interface OrderItemService {


	//邏輯
	void addOrderItem(List<OrderItem> orderItems);		      //把orderItems丟到資料庫 建訂單用的
	OrderItem cartItemToOrderItem(CartItem cartItem); //cartItem 轉成 OrderItem   
}
