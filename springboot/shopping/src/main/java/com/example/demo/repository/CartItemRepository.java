package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long>{
	//已有方法 find.... save delete
	
    // 你可以加自訂的方法，像是：
	List<CartItem> findByUserId(Long userId);
}
