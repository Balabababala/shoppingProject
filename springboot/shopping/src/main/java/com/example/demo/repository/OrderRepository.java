package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long>{
	//已有方法 find.... save delete
	
}
