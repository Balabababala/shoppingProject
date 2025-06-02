package com.example.demo.repository;

import com.example.demo.model.entity.OrderItem;

public interface OrderItemRepository {
	//已有方法 find.... save delete
	void save(OrderItem orderItem);
}
