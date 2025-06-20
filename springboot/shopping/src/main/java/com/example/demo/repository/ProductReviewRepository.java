package com.example.demo.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.ProductReview;
import com.example.demo.model.entity.User;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long>{
	
	
	
	@Transactional
	boolean existsByUserAndProduct(User user, Product product);

	@Transactional(readOnly = true)
	@Query("SELECT pr FROM ProductReview pr JOIN FETCH pr.user WHERE pr.product.id = :productId AND pr.isVisible = true")
	List<ProductReview> findByProductIdAndIsVisibleTrue(Long productId);

	
	@Transactional
	Optional<ProductReview> findByUserIdAndProductId(Long userId,Long productId);
	
	@Transactional
	List<ProductReview> findByUserId(Long userId);
	

}
