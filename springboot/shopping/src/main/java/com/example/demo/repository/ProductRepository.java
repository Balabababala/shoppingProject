package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository <Product, Long>{
	//已有方法 find.... save delete
	
    // 你可以加自訂的方法，像是：
	Optional<Product> findById(Long id);
}
