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
	@Query(
			  value = "SELECT EXISTS(SELECT 1 FROM product_reviews WHERE user_id = :userId AND product_id = :productId)",
			  nativeQuery = true
			)
	boolean existsByUserAndProduct(User user, Product product);

	@Transactional(readOnly = true)
	@Query(
			  value = "SELECT u.* FROM users u " +
			          "JOIN product_reviews pr ON u.id = pr.user_id " +
			          "WHERE pr.product_id = :productId AND pr.is_visible = true",
			  nativeQuery = true
			)
	List<ProductReview> findByProductIdAndIsVisibleTrue(Long productId);

	
	@Transactional
	List<ProductReview> findByUserId(Long userId);
	

}
