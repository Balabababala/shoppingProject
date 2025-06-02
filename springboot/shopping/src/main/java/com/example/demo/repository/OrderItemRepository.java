package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository <OrderItem, Long>{
	//已有方法 find.... save delete

}
