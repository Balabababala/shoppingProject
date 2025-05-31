package com.example.demo.service.Impl;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.demo.model.entity.Order;
import com.example.demo.repository.OrderRepository;
import com.example.demo.service.OrderService;

public class OrderServiceImpl implements OrderService{

	@Autowired
	private OrderRepository orderRepository; 
	
	@Override
	public void CreateOrder(Order order) {
		orderRepository.save(order);
	}
	
}
